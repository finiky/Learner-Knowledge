/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import PostAnswer from "./PostAnswer";

describe("When the user is on the HomePage,", () => {
  let container = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("renders a fake answer with a questionId and description, then checks to see if question description is being rendered", async () => {
    // mock data to be mock fetched
    const fakeData = [
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

    // data fetch mock
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData),
      })
    );

    // an asynchronous act function that renders the PostAnswer component
    await act(async () => {
      render(
        <Router>
          <PostAnswer />
        </Router>,
        container
      );
    });

    //testing for the p tag to be 'What is HTML?'
    let questionDescription = container.querySelector("p");
    expect(questionDescription.textContent).toBe(
      fakeData[0].questiondescription
    );

    //removes mock to ensure test is isolated
    global.fetch.mockRestore();
  });

  it("tests for the button to contain 'Submit' as its text", async () => {
    await act(async () => {
      render(
        <Router>
          <PostAnswer />
        </Router>,
        container
      );
    });

    let button = container.querySelector("button");
    expect(button.textContent).toBe("Submit");
  });

  it("renders an error if fetched url is not valid", async () => {
    // making an invalid fetch
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => {
      render(
        <Router>
          <PostAnswer />
        </Router>,
        container
      );
    });

    let errorMessage = container.querySelector(".list-item");
    expect(errorMessage.textContent).toBe("Oops, something went wrong!");

    global.fetch.mockRestore();
  });

  it("checks for the h1 tag and expects the text to be 'Post Answer'", async () => {
    await act(async () => {
      render(
        <Router>
          <PostAnswer />
        </Router>,
        container
      );
    });

    let heading = container.querySelector("h1");
    expect(heading.textContent).toBe("Post Answer");
  });
});
