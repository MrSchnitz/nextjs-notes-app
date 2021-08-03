import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import NotesPage, { NotesPageProps } from "./[index]";
import { NoteObject } from "../../models/Note";
import { initializeStore } from "../../store/configureStore";
import { Provider } from "react-redux";

describe("Notes page", () => {
  let wrapper: ShallowWrapper;
  const store = initializeStore();

  beforeEach(() => {
    const mockProps: NotesPageProps = {
      session: null,
      userNotes: [NoteObject, NoteObject],
    };

    wrapper = shallow(
      <Provider store={store}>
        <NotesPage {...mockProps} />
      </Provider>
    );
  });

  it("should render Notes page", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
