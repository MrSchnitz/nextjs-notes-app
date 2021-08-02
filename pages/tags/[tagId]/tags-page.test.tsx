import React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import {Provider} from "react-redux";
import {initializeStore} from "../../../store/configureStore";
import TagsPage, {TagsPageProps} from "./index";
import {NoteObject} from "../../../models/Note";

describe("Tags page", () => {
    let wrapper: ShallowWrapper;
    const store = initializeStore();

    beforeEach(() => {
        const mockProps: TagsPageProps = {
            session: null,
            tagNotes: [NoteObject],
        };

        wrapper = shallow(
            <Provider store={store}>
                <TagsPage {...mockProps} />
            </Provider>
        );
    });

    it("should render Tags page", () => {
        expect(wrapper).toMatchSnapshot();
    });
});
