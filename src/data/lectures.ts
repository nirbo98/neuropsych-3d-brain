import type { Lecture, LectureSlide } from '../types/brain.types';
import { lectures } from './lectures.generated';

/** All lecture decks (ordered). */
export const allLectures: Lecture[] = lectures;

/** Look up a lecture by its id. */
export function getLecture(id: string): Lecture | undefined {
  return lectures.find((l) => l.id === id);
}

/** A slide together with its parent lecture, for citation in the UI. */
export interface SlideWithLecture {
  slide: LectureSlide;
  lectureId: string;
  lectureTitle: string;
}

/**
 * The simulator ↔ lecture bridge: every slide mapped to a brain region,
 * carrying enough context to cite it ("— <lecture>, slide N").
 */
export function slidesByRegion(regionId: string | null): SlideWithLecture[] {
  if (!regionId) return [];
  const out: SlideWithLecture[] = [];
  for (const lecture of lectures) {
    for (const slide of lecture.slides) {
      if (slide.regionId === regionId) {
        out.push({ slide, lectureId: lecture.id, lectureTitle: lecture.title });
      }
    }
  }
  return out;
}

/** Set of region ids that currently have at least one mapped slide. */
export function regionsWithSlides(): Set<string> {
  const ids = new Set<string>();
  for (const lecture of lectures) {
    for (const slide of lecture.slides) {
      if (slide.regionId) ids.add(slide.regionId);
    }
  }
  return ids;
}
