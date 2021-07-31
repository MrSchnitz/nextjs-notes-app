// import {MainAPI, MainApiInterface, MainApiName, MainApiReducer, MainApiSaga,} from "./MainAPI";
// import {takeLatest} from "redux-saga/effects";
//
// describe("MainAPI", () => {
//   describe("Reducer slices tests", () => {
//     const initialState: MainApiInterface = {
//       numbers: [],
//       text: "",
//       predictionWordsLoading: false,
//       predictionWords: [],
//     };
//
//     it("should return initial state", () => {
//       expect(MainApiReducer(undefined, { type: null })).toEqual(initialState);
//     });
//
//     it("should add number", () => {
//       expect(
//         MainApiReducer(initialState, {
//           type: MainAPI.addNumber.type,
//           payload: 5,
//         }).numbers[0]
//       ).toEqual(5);
//     });
//
//     it("should change text", () => {
//       initialState.numbers = [10];
//       const word: WordType = { id: "0", word: "good" };
//       expect(
//         MainApiReducer(initialState, {
//           type: MainAPI.changeText.type,
//           payload: word,
//         }).text
//       ).toEqual(word.word + " ");
//
//       expect(
//         MainApiReducer(initialState, {
//           type: MainAPI.changeText.type,
//           payload: word,
//         }).numbers.length
//       ).toEqual(0);
//     });
//
//     describe("should delete text", () => {
//       it("should delete letter with space", () => {
//         initialState.numbers = [];
//         initialState.text = "good ";
//         expect(
//           MainApiReducer(initialState, { type: MainAPI.deleteText.type }).text
//         ).toEqual("goo");
//       });
//
//       it("should delete letter without space", () => {
//         initialState.numbers = [];
//         initialState.text = "home";
//         expect(
//           MainApiReducer(initialState, { type: MainAPI.deleteText.type }).text
//         ).toEqual("hom");
//       });
//
//       it("should delete number first", () => {
//         initialState.numbers = [1, 2, 3];
//         initialState.text = "good";
//         expect(
//           MainApiReducer(initialState, { type: MainAPI.deleteText.type })
//             .numbers.length
//         ).toEqual(2);
//         expect(
//           MainApiReducer(initialState, { type: MainAPI.deleteText.type }).text
//         ).toEqual("good");
//       });
//     });
//
//     it("should set loading", () => {
//       expect(
//         MainApiReducer(initialState, {
//           type: MainAPI.predictionWordsLoading.type,
//           payload: true,
//         }).predictionWordsLoading
//       ).toEqual(true);
//     });
//
//     it("should add prediction words", () => {
//       const words: WordType[] = [
//         { id: "0", word: "good" },
//         { id: "1", word: "home" },
//         { id: "3", word: "doom" },
//       ];
//
//       expect(
//         MainApiReducer(initialState, {
//           type: MainAPI.addPredictionWords.type,
//           payload: words,
//         }).predictionWordsLoading
//       ).toEqual(false);
//
//       expect(
//         MainApiReducer(initialState, {
//           type: MainAPI.addPredictionWords.type,
//           payload: words,
//         }).predictionWords.length
//       ).toEqual(words.length);
//     });
//   });
//
//   describe("Action tests", () => {
//     it("should create an action to add number", () => {
//       const expectedAction = {
//         type: `${MainApiName}/addNumber`,
//         payload: 5,
//       };
//       expect(MainAPI.addNumber(5)).toEqual(expectedAction);
//     });
//
//     it("should create an action to change text", () => {
//       const word: WordType = { id: "0", word: "good" };
//       const expectedAction = {
//         type: `${MainApiName}/changeText`,
//         payload: word,
//       };
//       expect(MainAPI.changeText(word)).toEqual(expectedAction);
//     });
//
//     it("should create an action to delete text", () => {
//       const expectedAction = {
//         type: `${MainApiName}/deleteText`,
//       };
//       expect(MainAPI.deleteText()).toEqual(expectedAction);
//     });
//
//     it("should create an action to set prediction words loading state", () => {
//       const expectedAction = {
//         type: `${MainApiName}/predictionWordsLoading`,
//         payload: true,
//       };
//       expect(MainAPI.predictionWordsLoading(true)).toEqual(expectedAction);
//     });
//
//     it("should create an action to add prediction words", () => {
//       const words: WordType[] = [
//         { id: "0", word: "good" },
//         { id: "1", word: "home" },
//         { id: "3", word: "doom" },
//       ];
//
//       const expectedAction = {
//         type: `${MainApiName}/addPredictionWords`,
//         payload: words,
//       };
//       expect(MainAPI.addPredictionWords(words)).toEqual(expectedAction);
//     });
//   });
//
//   describe("Saga tests", () => {
//     it("should trigger on add number and delete text", async () => {
//       const generator = MainApiSaga();
//       expect(generator.next().value).toEqual(
//         takeLatest(
//           [MainAPI.addNumber.type, MainAPI.deleteText.type],
//           handleT9Number
//         )
//       );
//     });
//   });
// });
