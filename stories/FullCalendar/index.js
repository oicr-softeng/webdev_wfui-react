import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Story from 'raw!./Story.src';
import FullCalendar from '../../src/FullCalendar';
import '../../src/FullCalendar/fullcalendar.min.css';

storiesOf('FullCalendar', module)
  .addWithInfo(
    'Default',
    () => Story,
    { scope: { FullCalendar } }
);
