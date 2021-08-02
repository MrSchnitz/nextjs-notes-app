import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { TagObject, TagType } from "../../models/Tag";
import { ChangeActionType } from "../../internals/helpers";
import { Tag } from "@prisma/client";
import { del, post, put as update } from "../../internals/RestAPI";
import { toast } from "react-toastify";
import { RootState } from "../../store/RootState";

/**
 * TagsAPI State interface
 */
export interface TagsAPIInterface {
  newTag: TagType;
  tags: TagType[];
  tagsLoading: boolean;
}

export const getInitialState = (): TagsAPIInterface => {
  return {
    newTag: TagObject,
    tags: [],
    tagsLoading: false,
  };
};

/**
 * TagsAPI
 */
class TagsApi {
  private static instance: TagsApi;

  private constructor() {
    this.handleFetchTags = this.handleFetchTags.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleUpdateTag = this.handleUpdateTag.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);

    this.saga = this.saga.bind(this);
  }

  public static getInstance(): TagsApi {
    if (TagsApi.instance) {
      return this.instance;
    }
    this.instance = new TagsApi();
    return this.instance;
  }

  /*
   * SLICE
   */
  public slice = createSlice({
    name: "tagsApiSlice",
    initialState: getInitialState(),
    reducers: {
      reset: (state) => getInitialState(),
      handleChange(state, action: PayloadAction<ChangeActionType>) {
        const tag: any = state.newTag;
        tag[action.payload.attr] = action.payload.value;
        state.newTag = tag;
      },
      fetchTags(state) {
        state.tagsLoading = true;
      },
      setTags(state, action: PayloadAction<TagType[]>) {
        state.tags = action.payload;
        state.tagsLoading = false;
      },
      addTag() {},
      updateTag(state, action: PayloadAction<TagType>) {},
      deleteTag(state, action: PayloadAction<TagType>) {},
    },
  });

  /*
   * SAGAS
   */
  public *handleFetchTags(): Generator<any> {
    const request = () =>
      fetch(`/api/tags`, {
        method: "GET",
      }).then((res) => res.json());

    try {
      const tags: any = yield call(request);

      yield put(this.slice.actions.setTags(tags));
    } catch (e) {
      console.log(e);
    }
  }

  public *handleAddTag(): Generator<any> {
    const tag: TagType | any = yield select(selectNewTag);

    if (tag.name.length === 0) {
      toast.warning(`You need to set the tag name.`);
      return;
    }

    toast.info(`Adding tag...`);

    const tagDTO: Tag = {
      id: "",
      name: tag.name,
      createdAt: Date.now() as any,
      userId: "",
    };

    try {
      const response = yield call(post, "/api/tags", tagDTO);
      toast.success("Tag added.");

      yield put(this.slice.actions.reset());
      yield put(this.slice.actions.fetchTags());
    } catch (e) {
      console.log(e);
      toast.error("Tag was not added. Something went wrong...");
    }
  }

  public *handleUpdateTag(action: PayloadAction<TagType>): Generator<any> {
    if (action.payload.name.length === 0) {
      toast.warning(`You need to set the tag name.`);
      return;
    }

    toast.info(`Updating tag...`);
    try {
      const response = yield call(update, "/api/tags", action.payload);
      toast.success("Tag updated.");

      yield put(this.slice.actions.reset());
      yield put(this.slice.actions.fetchTags());
    } catch (e) {
      console.log(e);
      toast.error("Tag was not added. Something went wrong...");
    }
  }

  public *handleDeleteTag(action: PayloadAction<TagType>): Generator<any> {
    toast.info(`Deleting tag...`);

    try {
      const res: any = yield call(del, `/api/tags/${action.payload.id}`);
      yield put(this.slice.actions.fetchTags());
      toast.success("Tag deleted.");
    } catch (e) {
      console.log(e);
      toast.error("Tag was not deleted. Something went wrong...");
    }
  }

  /*
   * SAGA - MAIN
   */
  public *saga(): Generator<any> {
    const { addTag, fetchTags, deleteTag, updateTag } = this.slice.actions;
    yield all([
      yield takeLatest([fetchTags.type], this.handleFetchTags),
      yield takeLatest([addTag.type], this.handleAddTag),
      yield takeLatest([updateTag.type], this.handleUpdateTag),
      yield takeLatest([deleteTag.type], this.handleDeleteTag),
    ]);
  }

  /*
   * SELECTORS
   */
  private selectDomain(state: RootState) {
    return state.tagsApiSlice || getInitialState();
  }

  public selectNewTag = createSelector(
    [this.selectDomain],
    (tagsApiState) => tagsApiState.newTag
  );

  public selectTags = createSelector(
    [this.selectDomain],
    (tagsApiState) => tagsApiState.tags
  );

  public selectTagsLoading = createSelector(
    [this.selectDomain],
    (tagsApiState) => tagsApiState.tagsLoading
  );
}

export default TagsApi.getInstance();

export const {
  actions: TagsAPI,
  reducer: TagsApiReducer,
  name: TagsApiName,
} = TagsApi.getInstance().slice;

export const {
  selectNewTag,
  selectTags,
  selectTagsLoading,
  saga: TagsApiSaga,
  handleUpdateTag,
  handleDeleteTag,
  handleAddTag,
  handleFetchTags,
} = TagsApi.getInstance();
