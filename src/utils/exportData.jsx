import Share from 'react-native-share';
import moment from 'moment';

export const exportMoodData = async moodData => {
  try {
    const entries = Object.entries(moodData);
    if (!entries.length) return;

    // Build CSV
    const header = 'Date,Mood,Value,Emoji,Tags,Note\n';
    const rows = entries
      .map(([date, e]) => {
        const note = (e.note || '').replace(/,/g, ';').replace(/\n/g, ' ');
        return `${date},${e.mood},${e.value},${e.emoji},${(e.tags || []).join(
          '|',
        )},${note}`;
      })
      .join('\n');

    const csv = header + rows;
    const base64 = Buffer.from(csv).toString('base64');

    await Share.open({
      title: 'Export Mood Data',
      filename: `mood-export-${moment().format('YYYY-MM-DD')}`,
      type: 'text/csv',
      url: `data:text/csv;base64,${base64}`,
    });
  } catch (error) {
    console.log('Export error:', error);
  }
};
