"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractErrorMessage(data: unknown): string | null {
  if (!isObject(data)) return null;
  const error = data.error;
  return typeof error === "string" ? error : null;
}

export function ContactForm({ className }: { className?: string }) {
  const formId = useId();
  const statusId = `${formId}-status`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage(null);

    const payload: ContactPayload = { name, email, message };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        return;
      }

      const data: unknown = await response.json().catch(() => null);
      const msg =
        extractErrorMessage(data) ?? "Não foi possível enviar a mensagem.";
      setErrorMessage(msg);
      setStatus("error");
    } catch {
      setErrorMessage("Erro de rede. Tente novamente em instantes.");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        void submit(e);
      }}
      className={cn("w-full max-w-lg space-y-4", className)}
      aria-describedby={statusId}
    >
      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-name`}>Nome</Label>
        <Input
          id={`${formId}-name`}
          name="name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
          minLength={2}
          autoComplete="name"
          placeholder="Seu nome"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-email`}>Email</Label>
        <Input
          id={`${formId}-email`}
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
          autoComplete="email"
          placeholder="voce@exemplo.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${formId}-message`}>Mensagem</Label>
        <Textarea
          id={`${formId}-message`}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          required
          minLength={10}
          placeholder="Escreva sua mensagem..."
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Enviar"}
        </Button>
        <p id={statusId} aria-live="polite" className="text-sm">
          {status === "success" ? (
            <span className="text-green-600 dark:text-green-400">
              Mensagem enviada com sucesso.
            </span>
          ) : null}
          {status === "error" ? (
            <span className="text-red-600 dark:text-red-400">
              {errorMessage}
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
