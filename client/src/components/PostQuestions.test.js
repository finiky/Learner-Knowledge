import React from "react";
import { unmountComponentAtNode, render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";
import PostQuestion from "./PostQuestion";

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

  it("test that it renders a mock question with topicId", async () => {
    const fakeData = {
      description: "Test",
      name: "HTML"
    };

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeData),
      })
    );

    await act(async () => {
      render(
        <Router>
          <PostQuestion />
        </Router>,
        container
      );

      let button = container.querySelector("button");
      expect(button.textContent).toBe("Submit");

      global.fetch.mockRestore();
    });
  });
  it("tests for the button to contain 'Submit' as its text", async () => {
    await act(async () => {
      render(
        <Router>
          <PostQuestion />
        </Router>,
        container
      );
    });

    let button = container.querySelector("button");
    expect(button.textContent).toBe("Submit");
  });
  it("renders an error if fetched url is not valid", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await act(async () => {
      render(
        <Router>
          <PostQuestion />
        </Router>,
        container
      );
    });

    let errorMessage = container.querySelector(".list-item");
    expect(errorMessage.textContent).toBe("Oops, something went wrong!");

    global.fetch.mockRestore();
  });

  it("checks for the h1 tag and expects the text to be 'Post Question", async () => {
    await act(async () => {
      render(
        <Router>
          <PostQuestion />
        </Router>,
        container
      );
    });

    let heading = container.querySelector("h1");
    expect(heading.textContent).toBe("Post Question");
  });
});
