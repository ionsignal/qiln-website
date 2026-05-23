export class QilnSubscribe extends HTMLElement {
  form: HTMLFormElement | null = null;
  input: HTMLInputElement | null = null;
  submitBtn: HTMLButtonElement | null = null;
  triggerBtn: HTMLButtonElement | null = null;
  cancelBtn: HTMLButtonElement | null = null;
  feedback: HTMLElement | null = null;

  actionUrl: string = "";
  msgSuccess: string = "";
  msgError: string = "";
  msgNetwork: string = "";

  connectedCallback() {
    this.form = this.querySelector("form") as HTMLFormElement | null;
    this.input = this.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement | null;
    this.submitBtn = this.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;
    this.triggerBtn = this.querySelector(
      ".morph-trigger",
    ) as HTMLButtonElement | null;
    this.cancelBtn = this.querySelector(
      ".morph-cancel",
    ) as HTMLButtonElement | null;
    this.feedback = this.querySelector(
      ".message-feedback",
    ) as HTMLElement | null;
    this.actionUrl = this.dataset.action || "";
    this.msgSuccess = this.dataset.msgSuccess || "Success!";
    this.msgError = this.dataset.msgError || "An error occurred.";
    this.msgNetwork = this.dataset.msgNetwork || "Network error.";
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.dataset.status = "idle";
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit);
    }
    if (this.input) {
      this.input.addEventListener("input", () => {
        if (this.dataset.status === "error") {
          this.dataset.status = "idle";
          this.hideMessage();
        }
      });
    }
    if (this.triggerBtn) {
      this.triggerBtn.addEventListener("click", this.expand);
      if (this.cancelBtn) {
        this.cancelBtn.addEventListener("click", (e: MouseEvent) => {
          e.stopPropagation();
          this.collapse();
        });
      }
      this.handleHashChange();
      window.addEventListener("hashchange", this.handleHashChange);
    }
  }

  disconnectedCallback() {
    if (this.triggerBtn) {
      window.removeEventListener("hashchange", this.handleHashChange);
    }
  }

  handleHashChange() {
    if (window.location.hash === "#early-testers") {
      this.expand();
    }
  }

  expand() {
    this.setAttribute("aria-expanded", "true");
    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 500);
  }

  collapse() {
    this.setAttribute("aria-expanded", "false");
    this.hideMessage();
    this.dataset.status = "idle";
    this.setLoading(false);
    if (this.input) {
      this.input.value = "";
      this.input.blur();
    }
    if (window.location.hash === "#early-testers") {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }

  async handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    if (!this.actionUrl || !this.form) return;
    this.setLoading(true);
    this.hideMessage();
    try {
      const formData = new FormData(this.form);
      const urlEncodedData = new URLSearchParams(formData as any).toString();
      const response = await fetch(this.actionUrl, {
        method: "POST",
        body: urlEncodedData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      //   await new Promise((resolve) => setTimeout(resolve, 800));
      //   const response = {
      //     ok: false,
      //     json: async () => ({
      //       message: "Thank you for joining our early testers!",
      //     }),
      //   };
      if (response.ok) {
        let msg = this.msgSuccess;
        try {
          const data = await response.json();
          if (data.message) msg = data.message;
        } catch (err) {
          // ignore JSON parse errors
        }
        this.dataset.status = "success";
        this.showMessage(msg);
        this.form.reset();
      } else {
        this.dataset.status = "error";
        this.showMessage(this.msgError);
      }
    } catch (error) {
      console.error("[QilnSubscribe] Error:", error);
      this.dataset.status = "error";
      this.showMessage(this.msgNetwork);
    } finally {
      if (this.dataset.status !== "success") {
        this.setLoading(false);
      }
    }
  }

  setLoading(isLoading: boolean) {
    if (this.input) this.input.disabled = isLoading;
    if (this.submitBtn) this.submitBtn.disabled = isLoading;
  }

  showMessage(msg: string) {
    if (!this.feedback) return;
    this.feedback.textContent = msg;
    this.feedback.className = "message-feedback block mt-2";
  }

  hideMessage() {
    if (!this.feedback) return;
    this.feedback.className = "message-feedback hidden";
    this.feedback.textContent = "";
  }
}
