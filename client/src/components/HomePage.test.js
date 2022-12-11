/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import HomePage from "./HomePage";
import { BrowserRouter as Router } from "react-router-dom";

describe("When the user is on the HomePage,", () => {
  let container = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    localStorage.setItem("x-auth-token", 1);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    localStorage.setItem("x-auth-token", null);
  });

  // Test Happy path, browsing tree is functional after successful fetch request

  it("they can select the year, then the term, then the topic.", async () => {
    const fakeTopicsData = [
      { id: 1, year: "Year 1", term: "Client Side", topic: "HTML" },
      { id: 9, year: "Year 1", term: "Client Side", topic: "Project1" },
    ];

    //Mock a succesful fetch response (ie status 200)
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(fakeTopicsData),
      })
    );

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(
        <Router>
          <HomePage />
        </Router>,
        container
      );
    });

    // Test year list is rendered
    let button = container.querySelector("button");
    expect(button.textContent).toBe("Year 1");

    // select a year
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // Test term list is rendered
    button = container.querySelector("button");
    expect(button.textContent).toBe("Client Side");

    // select a term
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // Test topics list is rendered
    button = container.querySelector("button");
    expect(button.textContent).toBe("HTML");

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });

  // Test error message is rendered if DB is not finctioning

  it("renders an error message when fetch returns a 500", async () => {
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
          <HomePage />
        </Router>,
        container
      );
    });

    let errorMessage = container.querySelector(".list-item");
    expect(errorMessage.textContent).toBe("Oops, something went wrong!");

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });

  // Test error message is rendered if API is not finctioning

  it("renders an error message when fetch throws an error", async () => {
    //Mock an unsuccesful fetch response (ie status 500, internal server error)
    jest.spyOn(global, "fetch").mockImplementation(() => {
      throw new Error();
    });

    // Use the asynchronous version of act to apply resolved promises
    await act(async () => {
      render(
        <Router>
          <HomePage />
        </Router>,
        container
      );
    });

    let errorMessage = container.querySelector(".list-item");
    expect(errorMessage.textContent).toBe("Oops, something went wrong!");

    // remove the mock to ensure tests are completely isolated
    global.fetch.mockRestore();
  });
});
