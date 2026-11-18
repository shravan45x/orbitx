export interface ParsedEventDate {
    monthShort: string; // e.g. "FEB"
    monthFull: string;  // e.g. "February"
    day: string;        // e.g. "19"
    year: string;       // e.g. "2026"
    fullDate: string;   // e.g. "19 February 2026"
}

export function parseEventDate(dateStr?: string): ParsedEventDate {
    if (!dateStr || typeof dateStr !== 'string') {
        return {
            monthShort: 'TBA',
            monthFull: 'Date TBA',
            day: '--',
            year: '----',
            fullDate: 'Date to be announced'
        };
    }

    const trimmed = dateStr.trim();

    // Pattern 1: YYYY-MM-DD
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
        const [yearNum, monthNum, dayNum] = trimmed.split('-').map(Number);
        const dObj = new Date(yearNum, monthNum - 1, dayNum);
        if (!isNaN(dObj.getTime())) {
            const monthShort = dObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const monthFull = dObj.toLocaleDateString('en-US', { month: 'long' });
            const day = String(dayNum);
            const year = String(yearNum);
            return {
                monthShort,
                monthFull,
                day,
                year,
                fullDate: `${day} ${monthFull} ${year}`
            };
        }
    }

    // Pattern 2: DD-MM-YYYY or DD/MM/YYYY
    if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(trimmed)) {
        const parts = trimmed.split(/[-/]/).map(Number);
        const dayNum = parts[0];
        const monthNum = parts[1];
        const yearNum = parts[2];
        const dObj = new Date(yearNum, monthNum - 1, dayNum);
        if (!isNaN(dObj.getTime())) {
            const monthShort = dObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const monthFull = dObj.toLocaleDateString('en-US', { month: 'long' });
            const day = String(dayNum);
            const year = String(yearNum);
            return {
                monthShort,
                monthFull,
                day,
                year,
                fullDate: `${day} ${monthFull} ${year}`
            };
        }
    }

    // Pattern 3: Standard JS parse
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
        const monthShort = parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const monthFull = parsed.toLocaleDateString('en-US', { month: 'long' });
        const day = String(parsed.getDate());
        const year = String(parsed.getFullYear());
        return {
            monthShort,
            monthFull,
            day,
            year,
            fullDate: `${day} ${monthFull} ${year}`
        };
    }

    // Fallback: Return raw string
    return {
        monthShort: 'DATE',
        monthFull: trimmed,
        day: '--',
        year: '',
        fullDate: trimmed
    };
}
