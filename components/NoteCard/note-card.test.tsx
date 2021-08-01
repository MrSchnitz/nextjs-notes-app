import * as React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import {Dialog, Divider, IconButton} from "@material-ui/core";
import NoteCard, {NoteCardProps} from "./note-card.component";
import {NoteObject, NoteTypeEnum} from "../../models/Note";
import {NoteCardComponent} from "./note-card.styles";
import {CheckPoint} from "../../models/CheckPoint";
import NoteCardCheckItem from "./NoteCardCheckItem/note-card-checkitem.component";

describe("NoteCard component", () => {
  let wrapper: ShallowWrapper;
  let mockOnHandleChange: any;
  let mockOnAddNote: any;
  let mockOnDeleteNote: any;
  let mockOnClick: any;
  let mockOnCheckItemClick: any;
  let mockOnCloseModal: any;

  beforeEach(() => {
    mockOnHandleChange = jest.fn();
    mockOnAddNote = jest.fn();
    mockOnDeleteNote = jest.fn();
    mockOnClick = jest.fn();
    mockOnCheckItemClick = jest.fn();
    mockOnCloseModal = jest.fn();

    const mockProps: NoteCardProps = {
      note: NoteObject,
      tags: [],
      editNote: NoteObject,
      onHandleChange: mockOnHandleChange,
      onAddNote: mockOnAddNote,
      onDeleteNote: mockOnDeleteNote,
      onClick: mockOnClick,
      onCheckItemClick: mockOnCheckItemClick,
      onCloseModal: mockOnCloseModal,
    };

    wrapper = shallow(<NoteCard {...mockProps} />);
  });

  it("should render NoteCard component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onClick when NoteCardComponent component is clicked", () => {
    wrapper.find(NoteCardComponent).simulate("click");
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("should call onClose when Dialog component closed", () => {
    wrapper.find(Dialog).simulate("close");
    expect(mockOnCloseModal).toHaveBeenCalled();
  });

  it("should call onDelete when IconButton is clicked", () => {
    wrapper
      .find(IconButton)
      .simulate("click", { stopPropagation: () => undefined });
    expect(mockOnDeleteNote).toHaveBeenCalled();
  });

    it("should render NoteCardCheckItem and Divider components when noteType is CHECK", () => {
        const noteModel = NoteObject;
        noteModel.noteType = NoteTypeEnum.CHECK;

        const checkedCheckpoint = CheckPoint;
        checkedCheckpoint.checked = true;
        noteModel.checkPoints = [CheckPoint, checkedCheckpoint];

        const mockProps: NoteCardProps = {
            note: NoteObject,
            tags: [],
            editNote: NoteObject,
            onHandleChange: mockOnHandleChange,
            onAddNote: mockOnAddNote,
            onDeleteNote: mockOnDeleteNote,
            onClick: mockOnClick,
            onCheckItemClick: mockOnCheckItemClick,
            onCloseModal: mockOnCloseModal,
        };

        wrapper = shallow(<NoteCard {...mockProps} />);

        const noteCardCheckpoints = wrapper.find(NoteCardCheckItem);
        expect(noteCardCheckpoints).toHaveLength(2);

        const divider = wrapper.find(Divider);
        expect(divider).toHaveLength(1);
    });
});
