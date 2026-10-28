export function EventRsvpFields({ fieldClass, labelClass }: { fieldClass: string; labelClass: string }) {
  return <fieldset className="space-y-4 rounded-xl border border-[var(--border)] p-4">
    <legend className="px-2 text-sm font-semibold text-[var(--navy-dk)]">Event invitations &amp; RSVPs</legend>
    <div><label htmlFor="event_description" className={labelClass}>Invitation / flight notes</label>
      <textarea id="event_description" name="description" maxLength={2000} rows={4} className={`${fieldClass} min-h-32 py-3`} /></div>
    <div><label htmlFor="event_capacity" className={labelClass}>Capacity (leave blank for unlimited)</label>
      <input id="event_capacity" name="capacity" type="number" min={1} max={100000} className={fieldClass} /></div>
    <div><label htmlFor="event_rsvp_close" className={labelClass}>RSVP deadline (Eastern; defaults to event start)</label>
      <input id="event_rsvp_close" name="rsvp_closes_at" type="datetime-local" className={fieldClass} /></div>
    <label className="flex min-h-11 items-center gap-3 text-sm text-[var(--navy-dk)]"><input type="checkbox" name="rsvp_enabled" defaultChecked className="h-6 w-6 accent-[var(--navy)]" />Allow RSVPs</label>
  </fieldset>;
}
