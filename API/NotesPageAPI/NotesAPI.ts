import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { all, call, delay, put, select, takeLatest } from "redux-saga/effects";
import { RootState } from "../../store/RootState";
import { ChangeActionType } from "../../internals/helpers";
import { cNoteModel, NoteObject, NoteType } from "../../models/Note";
import { del, get, post, put as update } from "../../internals/RestAPI";
import { toast } from "react-toastify";
import { TagType } from "../../models/Tag";
import {
  CheckPointObject,
  CheckPointType,
} from "../../models/CheckPointObject";
import { ApiLinks, PageLinks } from "../../internals/Links";

/**
 * NotesPage API State interface
 */
export interface NotesApiInterface {
  newNote: NoteType;
  editNote: NoteType | null;
  searchNotes: NoteType[];
  searchNoteQuery: string;
  searchNotesLoading: boolean;
  currentRoute: string;
}

export type SetNoteType = {
  note: NoteType;
  edit?: boolean;
};

export type SearchNoteQuery = {
  query: string;
  tagId?: string;
};

const NoteInit: NoteType = { ...NoteObject };
NoteInit.checkPoints = [CheckPointObject];

export const getInitialState = (): NotesApiInterface => {
  return {
    newNote: NoteInit,
    editNote: null,
    searchNotes: [],
    searchNoteQuery: "",
    searchNotesLoading: false,
    currentRoute: PageLinks.notesPage,
  };
};

/**
 * NotesPage API
 */
class NotesApi {
  private static instance: NotesApi;

  private constructor() {
    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckNoteAndSubmit = this.handleCheckNoteAndSubmit.bind(this);
    this.handleOnSearchNotes = this.handleOnSearchNotes.bind(this);
    this.saga = this.saga.bind(this);
  }

  public static getInstance(): NotesApi {
    if (NotesApi.instance) {
      return this.instance;
    }
    this.instance = new NotesApi();
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
          const editedNote = { ...action.payload.note };
          editedNote.checkPoints = checkPoints;

          state.editNote = editedNote;
        } else {
          state.newNote = action.payload.note;
        }
      },
      setSearchNotes(state, action: PayloadAction<NoteType[]>) {
        state.searchNotes = action.payload;
        state.searchNotesLoading = false;
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
      searchNotes(state, action: PayloadAction<SearchNoteQuery>) {
        state.searchNotesLoading = true;
        state.searchNoteQuery = action.payload.query;
      },
    },
  });

  /*
   * SAGAS
   */
  public *handleChange(
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
      if (value === CheckPointObject) {
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
            note.checkPoints = [CheckPointObject];
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
      toast.success("Note deleted.");
      yield put(this.slice.actions.reset());
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

    const noteCopy: NoteType = { ...note };

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

  public *handleOnSearchNotes(
    action: PayloadAction<SearchNoteQuery>
  ): Generator<any> {
    const { query, tagId } = action.payload;

    yield delay(500);

    if (action.payload.query.length === 0) {
      yield put(this.slice.actions.setSearchNotes([]));
      return;
    }

    try {
      const response: NoteType[] | any = yield call(
        get,
        `${ApiLinks.notes}/search?query=${query}${
          tagId ? `&tagId=${tagId}` : ""
        }`
      );

      yield delay(300);

      yield put(this.slice.actions.setSearchNotes(response));
    } catch (e) {
      console.log(e);
      toast.error(`Sorry, something went wrong...`);
    }
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
      searchNotes,
    } = this.slice.actions;
    yield all([
      yield takeLatest([handleChange.type], this.handleChange),
      yield takeLatest([addNote.type], this.handleAddNote),
      yield takeLatest([deleteNote.type], this.handleDeleteNote),
      yield takeLatest(
        [checkNoteAndSubmit.type],
        this.handleCheckNoteAndSubmit
      ),
      yield takeLatest([searchNotes.type], this.handleOnSearchNotes),
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

  public selectSearchNotes = createSelector(
    [this.selectDomain],
    (notesPageApiState) => notesPageApiState.searchNotes
  );

  public selectSearchNotesQuery = createSelector(
    [this.selectDomain],
    (notesPageApiState) => notesPageApiState.searchNoteQuery
  );

  public selectSearchNotesLoading = createSelector(
    [this.selectDomain],
    (notesPageApiState) => notesPageApiState.searchNotesLoading
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
  actions: NotesAPI,
  reducer: NotesApiReducer,
  name: NotesApiName,
} = NotesApi.getInstance().slice;

export const { saga: NotesApiSaga } = NotesApi.getInstance();

export const {
  selectNote,
  selectSearchNotes,
  selectSearchNotesQuery,
  selectSearchNotesLoading,
  selectEditNote,
  selectCurrentRoute,
  handleAddNote,
  handleChange,
  handleCheckNoteAndSubmit,
  handleDeleteNote,
  handleOnSearchNotes,
} = NotesApi.getInstance();
