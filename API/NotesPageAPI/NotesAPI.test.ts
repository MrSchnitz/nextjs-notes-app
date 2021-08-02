import {
  getInitialState,
  handleAddNote,
  handleChange,
  handleCheckNoteAndSubmit,
  handleDeleteNote,
  handleOnSearchNotes,
  NotesAPI,
  NotesApiInterface,
  NotesApiName,
  NotesApiReducer,
  NotesApiSaga,
  SearchNoteQuery,
  SetNoteType,
} from "./NotesAPI";
import { NoteObject, NoteType } from "../../models/Note";
import { ChangeActionType } from "../../internals/helpers";
import { CheckPointObject } from "../../models/CheckPointObject";
import { takeLatest } from "@redux-saga/core/effects";

describe("NotesAPI", () => {
  describe("Reducer slices tests", () => {
    const initialState: NotesApiInterface = getInitialState();

    it("should return initial state", () => {
      expect(NotesApiReducer(undefined, { type: null })).toEqual(initialState);
    });

    it("should reset reducer", () => {
      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.reset,
        })
      ).toEqual(getInitialState());
    });

    it("should set Note", () => {
      const note: NoteType = NoteObject;
      note.name = "test";

      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.setNote.type,
          payload: {
            note: note,
            edit: false,
          },
        }).newNote
      ).toEqual(note);

      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.setNote.type,
          payload: {
            note: note,
            edit: true,
          },
        }).editNote
      ).toEqual(note);
    });

    it("should set search Notes", () => {
      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.setSearchNotes.type,
          payload: [NoteObject, NoteObject],
        }).searchNotes
      ).toHaveLength(2);

      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.setSearchNotes.type,
          payload: [NoteObject, NoteObject],
        }).searchNotesLoading
      ).toEqual(false);
    });

    it("should change current route", () => {
      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.changeCurrentRoute.type,
          payload: "route",
        }).currentRoute
      ).toEqual("route");
    });

    it("should search notes", () => {
      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.searchNotes.type,
          payload: {
            query: "note",
          },
        }).searchNoteQuery
      ).toEqual("note");

      expect(
        NotesApiReducer(initialState, {
          type: NotesAPI.searchNotes.type,
          payload: {
            query: "note",
          },
        }).searchNotesLoading
      ).toEqual(true);
    });
  });

  describe("Action tests", () => {
    it("should create an action to reset", () => {
      const expectedAction = {
        type: `${NotesApiName}/reset`,
      };
      expect(NotesAPI.reset()).toEqual(expectedAction);
    });

    it("should create an action to handleChange", () => {
      const actionType: ChangeActionType = { attr: "test", value: "test" };
      const expectedAction = {
        type: `${NotesApiName}/handleChange`,
        payload: {
          ...actionType,
        },
      };
      expect(NotesAPI.handleChange(actionType)).toEqual(expectedAction);
    });

    it("should create an action to set Note", () => {
      const setNoteType: SetNoteType = { note: NoteObject, edit: false };
      const expectedAction = {
        type: `${NotesApiName}/setNote`,
        payload: {
          ...setNoteType,
        },
      };
      expect(NotesAPI.setNote(setNoteType)).toEqual(expectedAction);
    });

    it("should create an action to set search Notes", () => {
      const expectedAction = {
        type: `${NotesApiName}/setSearchNotes`,
        payload: [NoteObject],
      };
      expect(NotesAPI.setSearchNotes([NoteObject])).toEqual(expectedAction);
    });

    it("should create an action to change current route", () => {
      const expectedAction = {
        type: `${NotesApiName}/changeCurrentRoute`,
        payload: "route",
      };
      expect(NotesAPI.changeCurrentRoute("route")).toEqual(expectedAction);
    });

    it("should create an action to add note", () => {
      const expectedAction = {
        type: `${NotesApiName}/addNote`,
        payload: true,
      };
      expect(NotesAPI.addNote(true)).toEqual(expectedAction);
    });

    it("should create an action to delete note", () => {
      const expectedAction = {
        type: `${NotesApiName}/deleteNote`,
        payload: NoteObject,
      };
      expect(NotesAPI.deleteNote(NoteObject)).toEqual(expectedAction);
    });

    it("should create an action to check note and submit", () => {
      const checkType = { note: NoteObject, checkitem: CheckPointObject };
      const expectedAction = {
        type: `${NotesApiName}/checkNoteAndSubmit`,
        payload: {
          ...checkType,
        },
      };
      expect(NotesAPI.checkNoteAndSubmit(checkType)).toEqual(expectedAction);
    });

    it("should create an action to search notes", () => {
      const noteQuery: SearchNoteQuery = { query: "test", tagId: "test" };
      const expectedAction = {
        type: `${NotesApiName}/searchNotes`,
        payload: {
          ...noteQuery,
        },
      };
      expect(NotesAPI.searchNotes(noteQuery)).toEqual(expectedAction);
    });
  });

  describe("Saga tests", () => {
    const generator = NotesApiSaga();
    it("should trigger on handle change", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([NotesAPI.handleChange.type], handleChange)
      );
    });

    it("should trigger on add note", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([NotesAPI.addNote.type], handleAddNote)
      );
    });

    it("should trigger on delete note", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([NotesAPI.deleteNote.type], handleDeleteNote)
      );
    });

    it("should trigger on check note and submit", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([NotesAPI.checkNoteAndSubmit.type], handleCheckNoteAndSubmit)
      );
    });

    it("should trigger on search notes", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([NotesAPI.searchNotes.type], handleOnSearchNotes)
      );
    });
  });
});
