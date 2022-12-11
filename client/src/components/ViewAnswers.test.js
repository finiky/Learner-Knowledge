/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ViewAnswers from "./ViewAnswers";
import { BrowserRouter as Router } from "react-router-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

/** HAPPY Paths - fetch data using API,
 */
test("renders answers data using fakeQuestionsData", async () => {
  const fakeQuestionsData = [
    {
      id: 1,
      questionid: 1,
      questiondescription: "What is HTML?",
      answerdescription:
        "Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.",
      isstarred: false,
      isreviewed: false,
    },
   
  ];

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeQuestionsData),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <ViewAnswers />
      </Router>,
      container
    );
  });

  const questionButton = container.querySelector(".title");

  expect(questionButton.textContent).toBe(fakeQuestionsData[0].questiondescription);

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
test("renders answers data using fakeAnswersData", async () => {
  const fakeAnswersData = [
    {
      id: 1,
      questionid: 1,
      questiondescription: "What is HTML?",
      answerdescription:
        "Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.",
      isstarred: false,
      isreviewed: false,
    },
  ];

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeAnswersData),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <ViewAnswers />
      </Router>,
      container
    );
  });
  const questionButton = container.querySelector(".link ");
  expect(questionButton.textContent).toBe(fakeAnswersData[0].answerdescription);
  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});

/** UNHAPPY Path - if server is down or API fetch fails,
it need to display "Oops, something went wrong!" error message 
*/
test(`renders "Oops, something went wrong!" unable to fetch data from api`, async () => {
  //Mock an unsuccesful fetch response (ie status 500, internal server error)
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: false,
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <ViewAnswers />
      </Router>,
      container
    );
  });

  let errorMessage = container.querySelector(".error-list-item");
  expect(errorMessage.textContent).toBe("Oops, something went wrong!");

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
