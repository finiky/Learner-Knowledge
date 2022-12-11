import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ViewQuestions from "./ViewQuestions";

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

it("renders a topic and a question", async () => {
  const fakeData = [
    {
      id: 1,
      description: "What is HTML?",
      topicid: 1,
      isstarred: false,
      isreviewed: false,
      name: "HTML",
    },
  ];

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeData),
    })
  );

  await act(async () => {
    render(
      <Router>
        <ViewQuestions />
      </Router>,
      container
    );
  });

  const questionsTitle = container.querySelector(".title");
  expect(questionsTitle.textContent).toBe(fakeData[0].name);

  const questionsDescription = container.querySelector(".link");
  expect(questionsDescription.textContent).toBe(fakeData[0].description);
  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});

it("renders an error message when fetch fails", async () => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: false,
    })
  );

  await act(async () => {
    render(
      <Router>
        <ViewQuestions />
      </Router>,
      container
    );
  });

  const errorMessage = container.querySelector(".list-item");
  expect(errorMessage.textContent).toBe("Oops, something went wrong!");

  global.fetch.mockRestore();
});
