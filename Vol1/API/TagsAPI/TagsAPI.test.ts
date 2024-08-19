import {
  getInitialState,
  handleAddTag,
  handleDeleteTag,
  handleFetchTags,
  handleUpdateTag,
  TagsAPI,
  TagsAPIInterface,
  TagsApiName,
  TagsApiReducer,
  TagsApiSaga,
} from "./TagsAPI";
import { ChangeActionType } from "../../lib/helpers";
import { takeLatest } from "@redux-saga/core/effects";
import { cTagModel, TagObject, TagType } from "../../models/Tag";

describe("TagsAPI", () => {
  describe("Reducer slices tests", () => {
    const initialState: TagsAPIInterface = getInitialState();

    it("should return initial state", () => {
      expect(TagsApiReducer(undefined, { type: null })).toEqual(initialState);
    });

    it("should reset reducer", () => {
      expect(
        TagsApiReducer(initialState, {
          type: TagsAPI.reset,
        })
      ).toEqual(getInitialState());
    });

    it("should handle change", () => {
      const tag: TagType = { ...TagObject };
      tag.name = "test";

      expect(
        TagsApiReducer(initialState, {
          type: TagsAPI.handleChange.type,
          payload: {
            attr: cTagModel.name,
            value: tag.name,
          },
        }).newTag
      ).toEqual(tag);
    });

    it("should fetch Tags", () => {
      expect(
        TagsApiReducer(initialState, {
          type: TagsAPI.fetchTags.type,
        }).tagsLoading
      ).toEqual(true);
    });

    it("should set Tags", () => {
      expect(
        TagsApiReducer(initialState, {
          type: TagsAPI.setTags.type,
          payload: [TagObject],
        }).tagsLoading
      ).toEqual(false);
      expect(
        TagsApiReducer(initialState, {
          type: TagsAPI.setTags.type,
          payload: [TagObject],
        }).tags
      ).toEqual([TagObject]);
    });
  });

  describe("Action tests", () => {
    it("should create an action to reset", () => {
      const expectedAction = {
        type: `${TagsApiName}/reset`,
      };
      expect(TagsAPI.reset()).toEqual(expectedAction);
    });

    it("should create an action to handleChange", () => {
      const actionType: ChangeActionType = { attr: "test", value: "test" };
      const expectedAction = {
        type: `${TagsApiName}/handleChange`,
        payload: {
          ...actionType,
        },
      };
      expect(TagsAPI.handleChange(actionType)).toEqual(expectedAction);
    });

    it("should create an action to fetch Tags", () => {
      const expectedAction = {
        type: `${TagsApiName}/fetchTags`,
      };
      expect(TagsAPI.fetchTags()).toEqual(expectedAction);
    });

    it("should create an action to set Tags", () => {
      const expectedAction = {
        type: `${TagsApiName}/setTags`,
        payload: [TagObject],
      };
      expect(TagsAPI.setTags([TagObject])).toEqual(expectedAction);
    });

    it("should create an action to add tag", () => {
      const expectedAction = {
        type: `${TagsApiName}/addTag`,
      };
      expect(TagsAPI.addTag()).toEqual(expectedAction);
    });

    it("should create an action to update tag", () => {
      const expectedAction = {
        type: `${TagsApiName}/updateTag`,
        payload: TagObject,
      };
      expect(TagsAPI.updateTag(TagObject)).toEqual(expectedAction);
    });

    it("should create an action to delete tag", () => {
      const expectedAction = {
        type: `${TagsApiName}/deleteTag`,
        payload: TagObject,
      };
      expect(TagsAPI.deleteTag(TagObject)).toEqual(expectedAction);
    });
  });

  describe("Saga tests", () => {
    const generator = TagsApiSaga();
    it("should trigger on fetch tags", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([TagsAPI.fetchTags.type], handleFetchTags)
      );
    });

    it("should trigger on add tag", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([TagsAPI.addTag.type], handleAddTag)
      );
    });

    it("should trigger on update tag", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([TagsAPI.updateTag.type], handleUpdateTag)
      );
    });

    it("should trigger on delete tag", async () => {
      expect(generator.next().value).toEqual(
        takeLatest([TagsAPI.deleteTag.type], handleDeleteTag)
      );
    });
  });
});
