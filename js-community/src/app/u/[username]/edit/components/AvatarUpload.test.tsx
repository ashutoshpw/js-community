/**
 * Tests for AvatarUpload component
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/utils";
import AvatarUpload from "./AvatarUpload";

describe("AvatarUpload", () => {
  const mockOnAvatarUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render current avatar", () => {
    render(
      <AvatarUpload
        currentAvatarUrl="https://example.com/avatar.jpg"
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    const avatar = screen.getByAltText("testuser");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("should render username initial when no avatar", () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("should show upload button", () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    expect(screen.getByText("Change Avatar")).toBeInTheDocument();
  });

  it("should accept image file upload", async () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    const file = new File(["dummy content"], "avatar.png", {
      type: "image/png",
    });
    const input = screen.getByLabelText(/change avatar/i) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
    });

    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockOnAvatarUpdate).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });

  it("should reject non-image files", async () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    const file = new File(["dummy content"], "document.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText(/change avatar/i) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
    });

    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(
        screen.getByText("Please select an image file"),
      ).toBeInTheDocument();
    });

    expect(mockOnAvatarUpdate).not.toHaveBeenCalled();
  });

  it("should reject files larger than 5MB", async () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    // Create a file larger than 5MB
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      "large.png",
      { type: "image/png" },
    );
    const input = screen.getByLabelText(/change avatar/i) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [largeFile],
    });

    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(
        screen.getByText("Image size must be less than 5MB"),
      ).toBeInTheDocument();
    });

    expect(mockOnAvatarUpdate).not.toHaveBeenCalled();
  });

  it("should disable upload button while uploading", async () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    const file = new File(["dummy content"], "avatar.png", {
      type: "image/png",
    });
    const input = screen.getByLabelText(/change avatar/i) as HTMLInputElement;

    Object.defineProperty(input, "files", {
      value: [file],
    });

    const event = new Event("change", { bubbles: true });
    input.dispatchEvent(event);

    await waitFor(() => {
      expect(input).toBeDisabled();
      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(input).not.toBeDisabled();
      },
      { timeout: 2000 },
    );
  });

  it("should display file size and type requirements", () => {
    render(
      <AvatarUpload
        currentAvatarUrl={null}
        username="testuser"
        onAvatarUpdate={mockOnAvatarUpdate}
      />,
    );

    expect(
      screen.getByText("JPG, PNG or GIF. Max size 5MB."),
    ).toBeInTheDocument();
  });
});
