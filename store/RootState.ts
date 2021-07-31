import { Action, ThunkAction } from "@reduxjs/toolkit";
import { all } from "redux-saga/effects";
import {
  NotesPageApiInterface,
  NotesPageApiReducer,
  NotesPageApiSaga,
} from "../API/NotesPageAPI/NotesPageAPI";
import { TagsAPIInterface, TagsApiReducer, TagsApiSaga } from "../API/TagsAPI/TagsAPI";

export interface RootState {
  // API
  notesPageApiSlice?: NotesPageApiInterface;
  tagsApiSlice?: TagsAPIInterface;
}

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export const mainReducers = {
  // API
  notesPageApiSlice: NotesPageApiReducer,
  tagsApiSlice: TagsApiReducer,
};

/**
 * IMPORT EVERY OTHER NOT SOMEWHERE ELSE INJECTED SAGA
 */
export default function* rootSaga() {
  yield all([NotesPageApiSaga(), TagsApiSaga()]);
}
