import { getOwnTicket } from "@/lib/tickets/server";
import { calendarFile } from "@/lib/tickets/calendar";
import { ticketStatus } from "@/lib/tickets/contracts";

export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await params;
  const result = await getOwnTicket(ticketId);
  const headers = {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
  if (!result.ticket) {
    const status =
      result.state === "unauthenticated"
        ? 401
        : result.state === "unconfigured" || result.state === "unavailable"
          ? 503
          : 404;
    return Response.json(
      {
        error:
          "Your calendar file is unavailable. Sign in and open your own active ticket.",
      },
      { status, headers },
    );
  }
  if (ticketStatus(result.ticket, Date.now()) === "Cancelled")
    return Response.json(
      { error: "This RSVP has been cancelled." },
      { status: 410, headers },
    );
  return new Response(calendarFile(result.ticket), {
    headers: {
      ...headers,
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="acm-event.ics"',
    },
  });
}
