import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { RootState } from "../../store/RootState";
import { ChangeActionType } from "../../utils/helpers";
import { cNoteModel, NoteObject, NoteType } from "../../models/Note";
import { del, post, put as update } from "../../utils/restAPI";
import { toast } from "react-toastify";
import { TagType } from "../../models/Tag";
import { CheckPoint, CheckPointType } from "../../models/CheckPoint";
import { ApiLinks, PageLinks } from "../../utils/Links";

/**
 * NotesPage API State interface
 */
export interface NotesPageApiInterface {
  newNote: NoteType;
  editNote: NoteType | null;
  notes: NoteType[];
  currentRoute: string;
}

type SetNoteType = {
  note: NoteType;
  edit?: boolean;
};

const NoteInit: NoteType = { ...NoteObject };
NoteInit.checkPoints = [CheckPoint];

const getInitialState = (): NotesPageApiInterface => {
  return {
    newNote: NoteInit,
    editNote: null,
    notes: [],
    currentRoute: PageLinks.notesPage,
  };
};

/**
 * NotesPage API
 */
class NotesPageApi {
  private static instance: NotesPageApi;

  private constructor() {
    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleChangeNote = this.handleChangeNote.bind(this);
    this.handleCheckNoteAndSubmit = this.handleCheckNoteAndSubmit.bind(this);
    this.saga = this.saga.bind(this);
  }

  public static getInstance(): NotesPageApi {
    if (NotesPageApi.instance) {
      return this.instance;
    }
    this.instance = new NotesPageApi();
    return this.instance;
  }

  /*
   * SLICE
   */

  public slice = createSlice({
    name: "notesPageSlice",
    initialState: getInitialState(),
    reducers: {
      reset: (state) => getInitialState(),
      handleChange(state, action: PayloadAction<ChangeActionType>) {},
      setNote(state, action: PayloadAction<SetNoteType>) {
        if (action.payload.edit) {
          const checkPoints: CheckPointType[] = action.payload.note.checkPoints!.map(
            (ch: CheckPointType, i: number) => ({
              id: i,
              text: ch.text,
              checked: ch.checked,
            })
          );
          const editedNote = Object.assign({}, action.payload.note);
          editedNote.checkPoints = checkPoints;

          state.editNote = editedNote;
        } else {
          state.newNote = action.payload.note;
        }
      },
      setNotes(state, action: PayloadAction<NoteType[]>) {
        state.notes = action.payload;
      },
      changeCurrentRoute(state, action: PayloadAction<string>) {
        state.currentRoute = action.payload;
      },
      addNote(state, action: PayloadAction<boolean>) {},
      deleteNote(state, action: PayloadAction<NoteType>) {},
      checkNoteAndSubmit(
        state,
        action: PayloadAction<{ note: NoteType; checkitem: CheckPointType }>
      ) {},
    },
  });

  /*
   * SAGAS
   */
  public *handleChangeNote(
    action: PayloadAction<ChangeActionType>
  ): Generator<any> {
    const { attr, value, edit } = action.payload;

    const note: NoteType | any = Object.assign(
      {},
      edit ? yield select(this.selectEditNote) : yield select(this.selectNote)
    );

    if (attr === cNoteModel.tags) {
      if (note.tags.find((f: TagType) => f.id === value.id)) {
        note.tags = note.tags.filter((t: TagType) => t.id !== value.id);
      } else {
        note.tags = [...note.tags, value];
      }
      return yield put(this.slice.actions.setNote({ note: note, edit: edit }));
    }

    if (attr === cNoteModel.checkPoints) {
      if (value === CheckPoint) {
        const lastCheckPointId = note.checkPoints![note.checkPoints!.length - 1]
          .id;

        const newCheckPoint: CheckPointType = {
          checked: false,
          id: lastCheckPointId! + 1,
          text: "",
        };

        note.checkPoints = [...note.checkPoints!, newCheckPoint];

        return yield put(
          this.slice.actions.setNote({ note: note, edit: edit })
        );
      } else {
        if (typeof value === "number") {
          if (note.checkPoints?.length === 1) {
            note.checkPoints = [CheckPoint];
          } else {
            note.checkPoints = note.checkPoints?.filter(
              (f: any) => f.id !== value
            );
          }
        } else {
          const checkPoints: CheckPointType[] = [...note.checkPoints!];
          const checkPointIndex = checkPoints.findIndex(
            (f: CheckPointType) => f.id === value.id
          );

          checkPoints[checkPointIndex] = value;

          note.checkPoints = [...checkPoints];
        }
        return yield put(
          this.slice.actions.setNote({ note: note, edit: edit })
        );
      }
    }

    note[attr] = value;

    yield put(this.slice.actions.setNote({ note: note, edit: edit }));
  }

  public *handleAddNote(action: PayloadAction<boolean>): Generator<any> {
    yield put(
      this.slice.actions.changeCurrentRoute(PageLinks.notesPageNewNote)
    );

    toast.info(`${action.payload ? "Updating" : "Adding"} note...`);

    const note: NoteType | any = action.payload
      ? yield select(this.selectEditNote)
      : yield select(this.selectNote);

    try {
      const response = yield call(
        action.payload ? update : post,
        ApiLinks.notes,
        note
      );

      yield put(this.slice.actions.reset());
      toast.success(`Note ${action.payload ? "updated" : "added"}.`);
    } catch (e) {
      console.log(e);
      toast.error(
        `Note was not ${
          action.payload ? "updated" : "added"
        }. Something went wrong...`
      );
    }

    yield put(this.slice.actions.changeCurrentRoute(PageLinks.notesPage));
  }

  public *handleDeleteNote(action: PayloadAction<NoteType>): Generator<any> {
    yield put(
      this.slice.actions.changeCurrentRoute(PageLinks.notesPageDeleteNote)
    );

    toast.info(`Deleting note...`);

    try {
      const res: any = yield call(del, `/api/notes/${action.payload.id}`);
      console.log(res);
      toast.success("Note deleted.");
    } catch (e) {
      console.log(e);
      toast.error("Note was not deleted. Something went wrong...");
    }

    yield put(this.slice.actions.changeCurrentRoute(PageLinks.notesPage));
  }

  public *handleCheckNoteAndSubmit(
    action: PayloadAction<{ note: NoteType; checkitem: CheckPointType }>
  ): Generator<any> {
    yield put(
      this.slice.actions.changeCurrentRoute(PageLinks.notesPageNewNote)
    );
    toast.info(`Updating note...`);

    const { note, checkitem } = action.payload;

    const noteCopy: NoteType = Object.assign({}, note);

    const editedCheckitems: CheckPointType[] = note.checkPoints!.map(
      (ch: CheckPointType) => (ch.id === checkitem.id ? checkitem : ch)
    );

    noteCopy.checkPoints = editedCheckitems;

    try {
      const response = yield call(update, ApiLinks.notes, noteCopy);

      yield put(this.slice.actions.reset());
      toast.success(`Note updated.`);
    } catch (e) {
      console.log(e);
      toast.error(`Note was not updated. Something went wrong...`);
    }

    yield put(this.slice.actions.changeCurrentRoute(PageLinks.notesPage));
  }

  /*
   * SAGA - MAIN
   */
  public *saga(): Generator<any> {
    const {
      addNote,
      deleteNote,
      handleChange,
      checkNoteAndSubmit,
    } = this.slice.actions;
    yield all([
      yield takeLatest([addNote.type], this.handleAddNote),
      yield takeLatest([deleteNote.type], this.handleDeleteNote),
      yield takeLatest([handleChange.type], this.handleChangeNote),
      yield takeLatest(
        [checkNoteAndSubmit.type],
        this.handleCheckNoteAndSubmit
      ),
    ]);
  }

  /*
   * SELECTORS
   */
  private selectDomain(state: RootState) {
    return state.notesPageApiSlice || getInitialState();
  }

  public selectNote = createSelector(
    [this.selectDomain],
    (notesPageApiState) => notesPageApiState.newNote
  );

  public selectEditNote = createSelector(
    [this.selectDomain],
    (notesPageApiState) => notesPageApiState.editNote
  );

  public selectCurrentRoute = createSelector(
    [this.selectDomain],
    (notesPageApiState) => notesPageApiState.currentRoute
  );
}

export const {
  actions: NotesPageAPI,
  reducer: NotesPageApiReducer,
  name: NotesPageApiName,
} = NotesPageApi.getInstance().slice;

export const { saga: NotesPageApiSaga } = NotesPageApi.getInstance();

export const {
  selectNote,
  selectEditNote,
  selectCurrentRoute,
} = NotesPageApi.getInstance();
