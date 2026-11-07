#!/usr/bin/env python3
"""Build the session and attendance-form calendars for index.qmd.

Reads materials/sessions.csv and writes two HTML partials that index.qmd
includes:

    _calendar_sessions.md    one link per session day (Teams event)
    _calendar_attendance.md  one link per session day (attendance form)

A day with an empty URL is shown as "Link coming soon" (not a link).
Uses only the Python standard library, so no packages are needed.
Run automatically by Quarto before each render (pre-render in _quarto.yml).
"""

import calendar
import csv
import html
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "materials" / "sessions.csv"
OUTPUTS = {
    "session": ROOT / "_calendar_sessions.md",
    "form": ROOT / "_calendar_attendance.md",
}

TZ = "GMT+3"
WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
WEEKDAY_FULL = list(calendar.day_name)  # Monday first
MONTH_NAME = list(calendar.month_name)


def load_sessions():
    """Return {date: row}. Fails loudly on duplicate dates or bad input."""
    sessions = {}
    with SOURCE.open(newline="", encoding="utf-8") as handle:
        for line_no, row in enumerate(csv.DictReader(handle), start=2):
            row = {key.strip(): (value or "").strip() for key, value in row.items()}
            if not row.get("date"):
                continue
            try:
                day = date.fromisoformat(row["date"])
            except ValueError as error:
                raise SystemExit(f"{SOURCE}:{line_no}: bad date {row['date']!r}") from error
            if day in sessions:
                raise SystemExit(f"{SOURCE}:{line_no}: two sessions on {day}")
            row["day"] = day
            sessions[day] = row
    return sessions


def describe(row, kind):
    """Accessible name for a linked day."""
    weekday = WEEKDAY_FULL[row["day"].weekday()]
    when = f"{weekday} {row['day'].day} {MONTH_NAME[row['day'].month]} {row['day'].year}, {row['time']} {TZ}"
    if kind == "session":
        return f"{when}, {row['title']}. Join session, opens in new tab"
    return f"{when}, {row['title']}. Attendance form, opens in new tab"


def day_cell(day, row, kind):
    if row is None:
        return f'<td class="cal-off"><span class="cal-day">{day.day}</span></td>'

    url = row["session_url" if kind == "session" else "form_url"]
    time_html = f'<span class="cal-time">{html.escape(row["time"])}</span>'
    tz_html = f'<span class="cal-tz">{TZ}</span>'
    day_html = f'<span class="cal-day">{day.day}</span>'

    if not url:
        return (
            '<td class="cal-pending">'
            f"{day_html}{time_html}{tz_html}"
            '<span class="cal-note">Link coming soon</span>'
            "</td>"
        )

    title = html.escape(f"{row['title']} ({row['time']} {TZ})", quote=True)
    label = html.escape(describe(row, kind), quote=True)
    return (
        '<td class="cal-has">'
        f'<a class="cal-link" href="{html.escape(url, quote=True)}" '
        f'target="_blank" rel="noopener" title="{title}" aria-label="{label}">'
        f"{day_html}{time_html}{tz_html}"
        "</a></td>"
    )


def month_table(year, month, sessions, kind):
    head = "".join(
        f'<th scope="col" abbr="{WEEKDAY_FULL[i]}">{WEEKDAY_SHORT[i]}</th>'
        for i in range(7)
    )
    rows = []
    for week in calendar.Calendar(firstweekday=0).monthdatescalendar(year, month):
        cells = []
        for day in week:
            if day.month != month:
                cells.append('<td class="cal-off"></td>')
            else:
                cells.append(day_cell(day, sessions.get(day), kind))
        rows.append("<tr>" + "".join(cells) + "</tr>")

    caption = f"{MONTH_NAME[month]} {year}"
    return (
        '<table class="cal-table">'
        f"<caption>{caption}</caption>"
        f"<thead><tr>{head}</tr></thead>"
        "<tbody>" + "".join(rows) + "</tbody>"
        "</table>"
    )


def build(kind, sessions):
    by_month = defaultdict(list)
    for day in sessions:
        by_month[(day.year, day.month)].append(day)

    intro = {
        "session": "Tap a highlighted day to join that session.",
        "form": "Tap a highlighted day to open that session's attendance form. "
                "The form opens 1 hour before each class.",
    }[kind]
    blocks = [
        f'<div class="cal" role="region" aria-label="{"Session" if kind == "session" else "Attendance form"} calendar">',
        "",
        f'<p class="cal-intro"><strong>All times are {TZ}.</strong> {intro}</p>',
        "",
    ]
    for year, month in sorted(by_month):
        blocks.append(month_table(year, month, sessions, kind))
        blocks.append("")
    blocks.append('<p class="cal-legend">Sessions has ended? '
                  'You can find the recordings!.</p>')
    blocks.append("")
    blocks.append("</div>")
    return "\n".join(blocks) + "\n"


def main():
    sessions = load_sessions()
    for kind, path in OUTPUTS.items():
        path.write_text(build(kind, sessions), encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
