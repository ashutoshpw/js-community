import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/utils";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it("should update form fields on user input", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.type(screen.getByLabelText(/subject/i), "Test subject here");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a long enough test message for validation.",
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Jane Doe");
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      "jane@example.com",
    );
    expect(screen.getByLabelText(/subject/i)).toHaveValue("Test subject here");
  });

  it("should validate required fields on submit", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it("should show error for invalid email", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  it("should show error for short subject", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "support");
    await user.type(screen.getByLabelText(/subject/i), "Hi"); // too short
    await user.type(
      screen.getByLabelText(/message/i),
      "This message is long enough for validation purposes.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/subject must be at least 5 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("should show error for short message", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "support");
    await user.type(screen.getByLabelText(/subject/i), "Valid subject");
    await user.type(screen.getByLabelText(/message/i), "Too short"); // < 20 chars
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/message must be at least 20 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("should clear error when user corrects the field", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    // Submit empty to trigger errors
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Start typing in name field
    await user.type(screen.getByLabelText(/full name/i), "Jane");

    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  it("should submit form with valid data and show success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "support");
    await user.type(screen.getByLabelText(/subject/i), "Valid subject line");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a sufficiently long message for the contact form.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });
  });

  it("should call the /api/contact endpoint with correct payload", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "feedback");
    await user.type(screen.getByLabelText(/subject/i), "Feature request");
    await user.type(
      screen.getByLabelText(/message/i),
      "I would love to see dark mode support added.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Jane Doe",
            email: "jane@example.com",
            category: "feedback",
            subject: "Feature request",
            message: "I would love to see dark mode support added.",
            website: "",
          }),
        }),
      );
    });
  });

  it("should display API error message on failed submission", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error, please try again." }),
    });

    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "support");
    await user.type(screen.getByLabelText(/subject/i), "Valid subject");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a long enough test message for validation.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/server error, please try again/i),
      ).toBeInTheDocument();
    });
  });

  it("should handle network errors gracefully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "sales");
    await user.type(screen.getByLabelText(/subject/i), "Billing question");
    await user.type(
      screen.getByLabelText(/message/i),
      "I need help understanding my invoice charges.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an unexpected error occurred/i),
      ).toBeInTheDocument();
    });
  });

  it("should allow sending another message after success", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "jane@example.com",
    );
    await user.selectOptions(screen.getByLabelText(/category/i), "support");
    await user.type(screen.getByLabelText(/subject/i), "My support question");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a long enough message body for the test.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /send another message/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /send message/i }),
      ).toBeInTheDocument();
    });
  });

  it("should show character count for message field", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    const messageInput = screen.getByLabelText(/message/i);
    await user.type(messageInput, "Hello");

    expect(screen.getByText(/5 \/ 5000/)).toBeInTheDocument();
  });

  it("should render category options for support, sales and feedback", () => {
    render(<ContactForm />);

    const select = screen.getByLabelText(/category/i);
    expect(select).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: /technical support/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /sales & billing/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /feedback & suggestions/i }),
    ).toBeInTheDocument();
  });
});
