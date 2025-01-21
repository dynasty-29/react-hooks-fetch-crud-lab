import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});




test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  // Simulate the dropdown change
  fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  // Wait for the state update after the change
  await waitFor(() => {
    expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
  });

  // Re-render to verify persistence of the updated value
  rerender(<App />);

  // Ensure the correct answer has been updated in the DOM
  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});

