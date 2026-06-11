import type { Hemisphere } from '../types/brain.types';

// ── Hemisphere / Autism Lens ────────────────────────────────
//
// Content for the "Hemispheres" view mode. It maps the classic
// left/right division of labour onto the neuroscience of autism, and
// then deliberately steps beyond the dichotomy (see `autismOverview`),
// since autism is better described by atypical *lateralisation and
// connectivity* than by any single hemisphere. Each item lists the
// brain regions it touches so the UI can pulse them as a "live example"
// in the 3D scene.

/** One autism-relevant feature attributed to a hemisphere. */
export interface AutismFeature {
  id: string;
  title: string;
  description: string;
  /** Region ids to pulse in the 3D scene as a live demonstration. */
  regionIds: string[];
}

/** A hemisphere's typical role and how autism presents through it. */
export interface HemisphereProfile {
  id: Hemisphere;
  label: string;
  color: string;
  tagline: string;
  summary: string;
  features: AutismFeature[];
}

/** A whole-brain / cross-hemisphere theme (beyond left vs right). */
export interface AutismOverviewItem {
  id: string;
  title: string;
  description: string;
  regionIds: string[];
}

export const hemisphereProfiles: Record<Hemisphere, HemisphereProfile> = {
  left: {
    id: 'left',
    label: 'Left Hemisphere',
    color: '#3b82f6',
    tagline: 'Language · sequencing · local detail',
    summary:
      'The left hemisphere is typically dominant for spoken language, grammar ' +
      'and step-by-step (sequential) processing. In autism, language often ' +
      'develops along an atypical path and the usual strong left-ward language ' +
      'dominance is frequently reduced, bilateral, or reversed.',
    features: [
      {
        id: 'language-development',
        title: 'Atypical language development',
        description:
          'Delayed first words, very literal interpretation, and echolalia ' +
          '(repeating heard phrases) — or, in others, precocious vocabulary. ' +
          "This reflects atypical organisation of the classic Broca–Wernicke " +
          'left-hemisphere language network.',
        regionIds: ['brocas_area', 'wernickes_area'],
      },
      {
        id: 'reduced-lateralization',
        title: 'Reduced language lateralisation',
        description:
          'Many autistic individuals show weaker, absent, or reversed left-ward ' +
          'dominance for language and process speech more bilaterally than ' +
          'neurotypical peers — a recurring imaging finding.',
        regionIds: ['brocas_area', 'wernickes_area', 'angular_gyrus'],
      },
      {
        id: 'local-detail',
        title: 'Detail-focused perception',
        description:
          "Enhanced attention to local detail ('weak central coherence' / " +
          'enhanced perceptual functioning): spotting fine patterns and ' +
          'regularities others miss, sometimes at the cost of the global gist.',
        regionIds: ['inferior_temporal_cortex', 'visual_association_cortex'],
      },
      {
        id: 'symbols-reading',
        title: 'Reading & symbols',
        description:
          'Uneven profiles are common — e.g. hyperlexia (early, fluent decoding ' +
          'of text) alongside difficulty extracting abstract meaning, linked to ' +
          'the left angular gyrus and reading network.',
        regionIds: ['angular_gyrus', 'wernickes_area'],
      },
    ],
  },
  right: {
    id: 'right',
    label: 'Right Hemisphere',
    color: '#f59e0b',
    tagline: 'Social cognition · faces · the big picture',
    summary:
      'The right hemisphere supports face processing, emotional tone of voice ' +
      '(prosody), holistic/global perception and aspects of social cognition. ' +
      'Many of the core social-communication features of autism map onto ' +
      'right-hemisphere and limbic networks.',
    features: [
      {
        id: 'face-processing',
        title: 'Face & eye-gaze processing',
        description:
          'Reduced or atypical fusiform face area response and less time spent ' +
          'looking at the eyes; faces may be processed more like objects, ' +
          'feature-by-feature rather than as a whole.',
        regionIds: ['fusiform_gyrus'],
      },
      {
        id: 'emotion-threat',
        title: 'Reading emotions & threat',
        description:
          'Atypical amygdala responses to faces and emotional cues, plus altered ' +
          'interoception (insula) — changing how feelings, both in oneself and in ' +
          'others, are detected and weighted.',
        regionIds: ['amygdala', 'insula'],
      },
      {
        id: 'mentalizing',
        title: 'Social attention & mentalising',
        description:
          "Differences in joint attention and 'theory of mind' (inferring others' " +
          'thoughts and intentions), linked to temporo-parietal and prefrontal ' +
          'social-brain networks.',
        regionIds: ['posterior_parietal_cortex', 'prefrontal_cortex'],
      },
      {
        id: 'prosody-global',
        title: 'Prosody & global perception',
        description:
          'The right-hemisphere homologue of auditory cortex carries tone-of-voice ' +
          '(prosody); flat or unusual intonation and a local-over-global ' +
          'perceptual style are frequently reported.',
        regionIds: ['primary_auditory_cortex', 'posterior_parietal_cortex'],
      },
    ],
  },
};

export const autismOverview: {
  disclaimer: string;
  items: AutismOverviewItem[];
} = {
  disclaimer:
    'The left/right split is a useful teaching device, but autism is better ' +
    'described by how brain networks connect and coordinate than by any single ' +
    'hemisphere. Profiles vary enormously between individuals.',
  items: [
    {
      id: 'lateralization',
      title: 'Atypical lateralisation',
      description:
        'Reduced hemispheric specialisation: functions that are usually clearly ' +
        'lateralised are spread more evenly — or unusually — across both sides.',
      regionIds: ['corpus_callosum', 'brocas_area', 'fusiform_gyrus'],
    },
    {
      id: 'connectivity',
      title: 'Connectivity (under & over)',
      description:
        'Evidence points to long-range under-connectivity between distant regions ' +
        'alongside local over-connectivity; the corpus callosum that links the ' +
        'hemispheres is often reduced in size.',
      regionIds: ['corpus_callosum'],
    },
    {
      id: 'cerebellum',
      title: 'Cerebellum',
      description:
        'One of the most consistent neuropathological findings is a reduction in ' +
        'Purkinje cells. Beyond movement, the cerebellum tunes timing, cognition ' +
        'and social processing.',
      regionIds: ['cerebellum'],
    },
    {
      id: 'amygdala-growth',
      title: 'Early amygdala overgrowth',
      description:
        'The amygdala tends to over-grow in early childhood and then develop ' +
        'atypically — associated with heightened anxiety and social-threat ' +
        'sensitivity.',
      regionIds: ['amygdala'],
    },
    {
      id: 'executive-repetitive',
      title: 'Flexibility & repetitive behaviour',
      description:
        'Differences in executive function and set-shifting, insistence on ' +
        'sameness and repetitive behaviours engage prefrontal, cingulate and ' +
        'basal-ganglia loops.',
      regionIds: ['prefrontal_cortex', 'cingulate_cortex', 'basal_ganglia'],
    },
  ],
};

/** Unique region ids implicated for one hemisphere (for the "pulse hemisphere" demo). */
export function hemisphereRegionIds(h: Hemisphere): string[] {
  return [...new Set(hemisphereProfiles[h].features.flatMap((f) => f.regionIds))];
}
