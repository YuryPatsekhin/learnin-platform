import React, { useState, useEffect } from 'react';
import { updateLessons } from '~Redux/Actions'
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import LessonInfo from './LessonInfo';
import EditLessonInfo from './EditLessonInfo';
import { useDispatch, useSelector } from "react-redux";
import api from '~/Services/api';
import './styles/schedule.css';

export const Schedule = () => {
  const [calendar, setCalendar] = useState(null);
  const [lessonInfoOpen, setLessonInfoOpen] = useState(false);
  const [editLessonInfoOpen, setEditLessonInfoOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLesson, setSelectedLesson] = useState({});
  const dispatch = useDispatch();

  const currentPupil = useSelector(state => state.currentPupil);
  const lessons = useSelector(state => {
    const user = state.lessons.find(el => el.pupil === currentPupil);
    return user && user.lessons;
  })

  useEffect(() => {
    if (currentPupil) {
      if (lessons) {
        initCalendar(lessons);
      } else {
        api.getLessons(currentPupil).then(answer => {
          if (answer && answer.lessons) {
            const lessons = answer.lessons;
            dispatch(updateLessons({ currentPupil, lessons }));
            initCalendar(lessons);
          } else {
            initCalendar([])
          }
        })
      }
    }
  }, [currentPupil, lessons]);


  const eventClick = (info) => {
    info.jsEvent.preventDefault();
    const lesson = {
      theme: info.event.title,
      material: info.event.url,
    }

    setSelectedLesson(lesson);
    openEditLessonInfo();
  };

  const addLesson = (lessonInfo) => {
    const event = {
      title: lessonInfo.theme,
      url: lessonInfo.material,
      start: selectedDate,
      test: 'test'
    };
    const lesson = {
      event,
      currentPupil
    }
    api.addLesson(lesson).then(answer => {
      if (answer && answer.lessons) {
        const lessons = answer.lessons;
        dispatch(updateLessons({ currentPupil, lessons }));
        calendar.addEvent(event);
      }
    })
  };

  const openLessonInfo = () => {
    setLessonInfoOpen(true);
  };

  const openEditLessonInfo = () => {
    setEditLessonInfoOpen(true);
  };

  const closeLessonInfo = () => {
    setLessonInfoOpen(false);
  };

  const closeEditLessonInfo = () => {
    setEditLessonInfoOpen(false);
  };

  const dateClick = (info) => {
    setSelectedDate(info.dateStr);
    setLessonInfoOpen(true);
  };

  const initCalendar = (lessons) => {
    const calendarEl = document.getElementById('calendar');
    const calendar = new Calendar(calendarEl, {
      plugins: [interactionPlugin, dayGridPlugin],
      dateClick,
      eventClick,
      events: lessons,
    });

    calendar.render();
    setCalendar(calendar);
  };

  return (
    currentPupil &&
    <>
      <EditLessonInfo lesson={selectedLesson} open={editLessonInfoOpen} openLessonInfo={openLessonInfo} closeEditLessonInfo={closeEditLessonInfo} />
      <LessonInfo open={lessonInfoOpen} closeLessonInfo={closeLessonInfo} addLesson={addLesson} />
      <div className='calendar' id='calendar'></div>
    </>
  );
};
