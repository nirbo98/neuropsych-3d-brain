import type { BrainRegion } from '../types/brain.types';

export const brainRegions: BrainRegion[] = [

  // ═══════════════════════════════════════════════════════════
  // FRONTAL LOBE REGIONS
  // ═══════════════════════════════════════════════════════════

  {
    id: 'prefrontal_cortex',
    name: 'Prefrontal Cortex (PFC)',
    position: [0, 0.6, 1.4],
    scale: [1.2, 0.8, 0.9],
    chapters: [11, 12, 13],
    functions: [
      'Executive functions', 'Planning', 'Decision-making',
      'Working memory', 'Cognitive flexibility', 'Inhibition',
      'Personality', 'Social behavior'
    ],
    lesionEffects: {
      executive: 90,
      attention: 60,
      memory: 40,
      emotion: 55,
      language: 15,
      motor: 10,
      spatial: 20,
      visual_perception: 5,
      somatosensory: 0,
      auditory: 5,
    },
    clinicalNotes:
      'PFC damage is associated with personality changes (cf. Phineas Gage), ' +
      'impaired planning and decision-making, utilization behavior, and reduced ' +
      'cognitive flexibility. Patients may show perseveration on the Wisconsin Card ' +
      'Sorting Test (Ch.11). Ventromedial PFC damage impairs somatic marker-based ' +
      'decision making (Damasio, Ch.12). Dorsolateral PFC damage impairs working memory.',
    color: '#6366f1',
    brodmannAreas: [9, 10, 11, 12, 46, 47],
  },

  {
    id: 'brocas_area',
    name: "Broca's Area (Left IFG)",
    position: [-0.9, 0.3, 0.9],
    scale: [0.5, 0.4, 0.5],
    chapters: [3, 8],
    functions: [
      'Speech production', 'Language planning',
      'Syntactic processing', 'Verbal working memory'
    ],
    lesionEffects: {
      language: 85,
      executive: 30,
      memory: 20,
      attention: 15,
      motor: 25,
      emotion: 10,
      spatial: 0,
      visual_perception: 0,
      somatosensory: 0,
      auditory: 10,
    },
    clinicalNotes:
      "Broca's aphasia: non-fluent, effortful speech with relatively preserved " +
      'comprehension. Patients understand language but struggle to produce it. ' +
      'Speech is telegraphic — missing function words and grammatical morphemes. ' +
      'Named after Paul Broca who described patient "Tan" (Ch.8).',
    color: '#22c55e',
    brodmannAreas: [44, 45],
  },

  {
    id: 'primary_motor_cortex',
    name: 'Primary Motor Cortex (M1)',
    position: [0, 0.9, 0.5],
    scale: [1.6, 0.3, 0.4],
    chapters: [4],
    functions: [
      'Voluntary movement execution',
      'Contralateral motor control',
      'Somatotopic motor mapping (homunculus)'
    ],
    lesionEffects: {
      motor: 95,
      somatosensory: 20,
      executive: 5,
      language: 10,
      memory: 0,
      attention: 5,
      spatial: 5,
      visual_perception: 0,
      emotion: 0,
      auditory: 0,
    },
    clinicalNotes:
      'Damage causes contralateral paralysis or paresis. The motor homunculus ' +
      'shows disproportionate representation of hands and face. Upper motor neuron ' +
      'lesions produce spasticity and hyperreflexia (Ch.4).',
    color: '#ec4899',
    brodmannAreas: [4],
  },

  {
    id: 'premotor_cortex',
    name: 'Premotor Cortex (PMC)',
    position: [0, 0.8, 0.8],
    scale: [1.4, 0.4, 0.4],
    chapters: [4],
    functions: [
      'Motor planning', 'Movement preparation',
      'Imitation', 'Action observation (mirror neurons)'
    ],
    lesionEffects: {
      motor: 60,
      executive: 25,
      spatial: 15,
      language: 5,
      memory: 5,
      attention: 10,
      visual_perception: 5,
      emotion: 5,
      somatosensory: 10,
      auditory: 0,
    },
    clinicalNotes:
      'Premotor lesions impair the planning and sequencing of complex movements. ' +
      'Ideomotor apraxia may result — patients cannot pantomime actions on command ' +
      'but can perform them spontaneously (Ch.4). Mirror neuron dysfunction may ' +
      'contribute to imitation deficits.',
    color: '#f472b6',
    brodmannAreas: [6],
  },

  {
    id: 'supplementary_motor_area',
    name: 'Supplementary Motor Area (SMA)',
    position: [0, 1.0, 0.6],
    scale: [0.6, 0.3, 0.4],
    chapters: [4],
    functions: [
      'Bimanual coordination', 'Internally-generated movement sequences',
      'Motor planning', 'Speech initiation'
    ],
    lesionEffects: {
      motor: 55,
      language: 20,
      executive: 20,
      attention: 10,
      memory: 5,
      spatial: 5,
      visual_perception: 0,
      emotion: 0,
      somatosensory: 5,
      auditory: 0,
    },
    clinicalNotes:
      'SMA lesions can cause alien hand syndrome and difficulties with bimanual ' +
      'coordination. Bilateral SMA damage may cause akinetic mutism — patients ' +
      'are awake but make no voluntary movements or speech (Ch.4).',
    color: '#f9a8d4',
    brodmannAreas: [6],
  },

  // ═══════════════════════════════════════════════════════════
  // PARIETAL LOBE REGIONS
  // ═══════════════════════════════════════════════════════════

  {
    id: 'primary_somatosensory_cortex',
    name: 'Primary Somatosensory Cortex (S1)',
    position: [0, 0.9, 0.2],
    scale: [1.6, 0.3, 0.4],
    chapters: [4, 7],
    functions: [
      'Touch processing', 'Proprioception',
      'Pain perception', 'Temperature sensation',
      'Somatotopic sensory mapping (sensory homunculus)'
    ],
    lesionEffects: {
      somatosensory: 90,
      spatial: 25,
      motor: 20,
      attention: 10,
      executive: 5,
      memory: 5,
      language: 0,
      visual_perception: 0,
      emotion: 5,
      auditory: 0,
    },
    clinicalNotes:
      'Damage causes contralateral loss of fine touch, proprioception, and ' +
      'two-point discrimination. The sensory homunculus shows large cortical ' +
      'areas for hands, lips, and tongue (Ch.4). Astereognosis — inability to ' +
      'recognize objects by touch — may result.',
    color: '#eab308',
    brodmannAreas: [1, 2, 3],
  },

  {
    id: 'posterior_parietal_cortex',
    name: 'Posterior Parietal Cortex (PPC)',
    position: [0, 0.7, -0.2],
    scale: [1.4, 0.6, 0.6],
    chapters: [7, 10],
    functions: [
      'Spatial awareness', 'Visuomotor integration',
      'Attention orienting', 'Mental rotation',
      'Reaching and grasping guidance'
    ],
    lesionEffects: {
      spatial: 85,
      attention: 70,
      motor: 30,
      visual_perception: 40,
      executive: 15,
      somatosensory: 20,
      memory: 10,
      language: 5,
      emotion: 5,
      auditory: 5,
    },
    clinicalNotes:
      'Right PPC damage causes hemispatial neglect (hemineglect) — patients ignore ' +
      'the left side of space (Ch.10). Bilateral damage causes Balint syndrome: ' +
      'simultanagnosia, optic ataxia, and oculomotor apraxia (Ch.7). Key region ' +
      'for the dorsal "where/how" visual stream.',
    color: '#f59e0b',
    brodmannAreas: [5, 7, 39, 40],
  },

  {
    id: 'angular_gyrus',
    name: 'Angular Gyrus',
    position: [-0.8, 0.5, -0.3],
    scale: [0.5, 0.4, 0.4],
    chapters: [7, 8],
    functions: [
      'Reading', 'Arithmetic', 'Semantic processing',
      'Spatial attention', 'Cross-modal integration'
    ],
    lesionEffects: {
      language: 50,
      spatial: 40,
      memory: 25,
      attention: 30,
      executive: 15,
      visual_perception: 15,
      motor: 0,
      emotion: 5,
      somatosensory: 5,
      auditory: 10,
    },
    clinicalNotes:
      'Left angular gyrus damage contributes to Gerstmann syndrome: acalculia, ' +
      'agraphia, finger agnosia, and left-right confusion (Ch.7, Ch.8). ' +
      'Important for reading and cross-modal integration.',
    color: '#fbbf24',
    brodmannAreas: [39],
  },

  // ═══════════════════════════════════════════════════════════
  // TEMPORAL LOBE REGIONS
  // ═══════════════════════════════════════════════════════════

  {
    id: 'wernickes_area',
    name: "Wernicke's Area (Left STG)",
    position: [-0.9, 0.1, -0.1],
    scale: [0.5, 0.3, 0.5],
    chapters: [8],
    functions: [
      'Speech comprehension', 'Auditory language processing',
      'Semantic retrieval'
    ],
    lesionEffects: {
      language: 80,
      auditory: 50,
      memory: 25,
      attention: 15,
      executive: 10,
      visual_perception: 0,
      spatial: 5,
      motor: 5,
      emotion: 10,
      somatosensory: 0,
    },
    clinicalNotes:
      "Wernicke's aphasia: fluent but meaningless speech (word salad/jargon) " +
      'with severely impaired comprehension. Patients are often unaware of their ' +
      'deficit (anosognosia for language). Named after Carl Wernicke (Ch.8).',
    color: '#4ade80',
    brodmannAreas: [22],
  },

  {
    id: 'primary_auditory_cortex',
    name: 'Primary Auditory Cortex (A1)',
    position: [-0.9, 0.2, 0.0],
    scale: [0.4, 0.3, 0.3],
    chapters: [5, 8],
    functions: [
      'Sound processing', 'Frequency discrimination',
      'Tonotopic mapping', 'Basic auditory perception'
    ],
    lesionEffects: {
      auditory: 85,
      language: 35,
      attention: 15,
      memory: 10,
      executive: 5,
      emotion: 5,
      spatial: 10,
      visual_perception: 0,
      motor: 0,
      somatosensory: 0,
    },
    clinicalNotes:
      'Bilateral damage causes cortical deafness. Unilateral damage causes ' +
      'subtle deficits in sound localization contralateral to the lesion. ' +
      'Auditory cortex is organized tonotopically (Ch.5).',
    color: '#34d399',
    brodmannAreas: [41, 42],
  },

  {
    id: 'hippocampus',
    name: 'Hippocampus',
    position: [0, -0.1, -0.3],
    scale: [1.0, 0.4, 0.5],
    chapters: [9, 12],
    functions: [
      'Episodic memory encoding', 'Spatial navigation',
      'Memory consolidation', 'Contextual memory',
      'Relational binding'
    ],
    lesionEffects: {
      memory: 90,
      spatial: 45,
      emotion: 20,
      attention: 15,
      executive: 10,
      language: 5,
      visual_perception: 5,
      motor: 0,
      somatosensory: 0,
      auditory: 0,
    },
    clinicalNotes:
      'Bilateral hippocampal damage causes severe anterograde amnesia — inability ' +
      'to form new declarative memories (cf. patient H.M./Henry Molaison, Ch.9). ' +
      'Retrograde amnesia follows a temporal gradient (Ribot law). Hippocampus is ' +
      'critical for spatial navigation (place cells) and memory consolidation.',
    color: '#14b8a6',
    brodmannAreas: [],
  },

  {
    id: 'fusiform_gyrus',
    name: 'Fusiform Face Area (FFA)',
    position: [-0.5, -0.3, -0.5],
    scale: [0.5, 0.3, 0.5],
    chapters: [6],
    functions: [
      'Face recognition', 'Expert-level visual categorization',
      'Within-category discrimination'
    ],
    lesionEffects: {
      visual_perception: 75,
      emotion: 25,
      memory: 15,
      language: 5,
      attention: 10,
      spatial: 10,
      executive: 5,
      motor: 0,
      somatosensory: 0,
      auditory: 0,
    },
    clinicalNotes:
      'Damage causes prosopagnosia — inability to recognize familiar faces, ' +
      'including one\'s own face in a mirror. Patients can still recognize people ' +
      'by voice, gait, or other cues. Part of the ventral "what" stream (Ch.6).',
    color: '#f97316',
    brodmannAreas: [37],
  },

  {
    id: 'inferior_temporal_cortex',
    name: 'Inferotemporal Cortex (IT)',
    position: [-0.6, -0.2, -0.4],
    scale: [0.6, 0.4, 0.6],
    chapters: [6],
    functions: [
      'Object recognition', 'Visual categorization',
      'Color perception', 'Form processing'
    ],
    lesionEffects: {
      visual_perception: 80,
      memory: 20,
      language: 15,
      attention: 10,
      spatial: 15,
      executive: 5,
      emotion: 10,
      motor: 0,
      somatosensory: 0,
      auditory: 0,
    },
    clinicalNotes:
      'Damage causes visual agnosia — inability to recognize objects despite intact ' +
      'vision. Apperceptive agnosia involves impaired perception; associative ' +
      'agnosia involves impaired meaning assignment. Part of the ventral "what" ' +
      'stream (Ch.6).',
    color: '#fb923c',
    brodmannAreas: [20, 21],
  },

  // ═══════════════════════════════════════════════════════════
  // OCCIPITAL LOBE REGIONS
  // ═══════════════════════════════════════════════════════════

  {
    id: 'primary_visual_cortex',
    name: 'Primary Visual Cortex (V1)',
    position: [0, 0.2, -1.2],
    scale: [1.0, 0.6, 0.4],
    chapters: [5],
    functions: [
      'Basic visual processing', 'Edge detection',
      'Orientation selectivity', 'Retinotopic mapping',
      'Simple and complex cell responses'
    ],
    lesionEffects: {
      visual_perception: 95,
      spatial: 50,
      attention: 20,
      memory: 10,
      language: 5,
      executive: 5,
      motor: 5,
      emotion: 5,
      somatosensory: 0,
      auditory: 0,
    },
    clinicalNotes:
      'Complete bilateral V1 damage causes cortical blindness. Unilateral damage ' +
      'causes contralateral visual field loss (hemianopia). Remarkably, some ' +
      'patients retain unconscious visual processing — blindsight (Ch.5). ' +
      'V1 is organized retinotopically.',
    color: '#f43f5e',
    brodmannAreas: [17],
  },

  {
    id: 'visual_association_cortex',
    name: 'Visual Association Cortex (V2-V5)',
    position: [0, 0.3, -1.0],
    scale: [1.2, 0.5, 0.4],
    chapters: [5, 6, 7],
    functions: [
      'Color processing (V4)', 'Motion detection (V5/MT)',
      'Complex form analysis', 'Depth processing',
      'Texture and pattern recognition'
    ],
    lesionEffects: {
      visual_perception: 70,
      spatial: 55,
      attention: 15,
      memory: 10,
      motor: 10,
      executive: 5,
      language: 5,
      emotion: 5,
      somatosensory: 0,
      auditory: 0,
    },
    clinicalNotes:
      'V4 damage causes achromatopsia (loss of color vision). V5/MT damage ' +
      'causes akinetopsia (motion blindness) — patients see the world in ' +
      'static frames. This is where the dorsal and ventral streams begin ' +
      'to diverge (Ch.5, Ch.7).',
    color: '#fb7185',
    brodmannAreas: [18, 19],
  },

  // ═══════════════════════════════════════════════════════════
  // SUBCORTICAL STRUCTURES
  // ═══════════════════════════════════════════════════════════

  {
    id: 'amygdala',
    name: 'Amygdala',
    position: [0, -0.2, 0.2],
    scale: [0.8, 0.4, 0.4],
    chapters: [12, 13],
    functions: [
      'Fear conditioning', 'Emotional memory',
      'Threat detection', 'Social emotion processing',
      'Emotional modulation of attention'
    ],
    lesionEffects: {
      emotion: 85,
      memory: 30,
      attention: 25,
      executive: 15,
      visual_perception: 10,
      language: 5,
      spatial: 5,
      motor: 0,
      somatosensory: 0,
      auditory: 5,
    },
    clinicalNotes:
      'Bilateral amygdala damage (e.g., Urbach-Wiethe disease, patient S.M.) ' +
      'impairs fear recognition, fear conditioning, and emotional enhancement of ' +
      'memory (Ch.12). Patients approach normally threatening stimuli without fear. ' +
      'Important for the somatic marker hypothesis (Damasio).',
    color: '#d946ef',
    brodmannAreas: [],
  },

  {
    id: 'basal_ganglia',
    name: 'Basal Ganglia',
    position: [0, 0.2, 0.2],
    scale: [0.8, 0.5, 0.6],
    chapters: [4, 11, 16],
    functions: [
      'Movement initiation and inhibition',
      'Procedural learning', 'Habit formation',
      'Reward processing', 'Action selection'
    ],
    lesionEffects: {
      motor: 75,
      executive: 35,
      memory: 25,
      emotion: 20,
      attention: 15,
      language: 10,
      spatial: 5,
      visual_perception: 0,
      somatosensory: 5,
      auditory: 0,
    },
    clinicalNotes:
      'Basal ganglia dysfunction underlies Parkinson disease (hypokinesia, ' +
      'bradykinesia, resting tremor) and Huntington disease (hyperkinesia, ' +
      'chorea). Also involved in procedural memory and habit learning (Ch.4, ' +
      'Ch.16). Dopaminergic pathways are critical.',
    color: '#a855f7',
    brodmannAreas: [],
  },

  {
    id: 'thalamus',
    name: 'Thalamus',
    position: [0, 0.1, 0.0],
    scale: [0.7, 0.5, 0.5],
    chapters: [2, 9, 10],
    functions: [
      'Sensory relay station', 'Attentional gating',
      'Consciousness modulation', 'Memory (diencephalic)',
      'Sleep-wake regulation'
    ],
    lesionEffects: {
      attention: 55,
      memory: 45,
      somatosensory: 40,
      visual_perception: 30,
      auditory: 30,
      executive: 25,
      motor: 20,
      emotion: 20,
      language: 15,
      spatial: 20,
    },
    clinicalNotes:
      'Thalamic lesions can cause diencephalic amnesia (midline thalamic nuclei, ' +
      'Ch.9), thalamic pain syndrome, and attentional deficits. The thalamus is ' +
      'the relay hub for nearly all sensory information reaching the cortex. ' +
      'Korsakoff syndrome involves mammillary bodies and thalamus.',
    color: '#8b5cf6',
    brodmannAreas: [],
  },

  {
    id: 'cerebellum',
    name: 'Cerebellum',
    position: [0, -0.4, -0.8],
    scale: [1.4, 0.6, 0.6],
    chapters: [4],
    functions: [
      'Motor coordination', 'Balance and posture',
      'Motor learning', 'Timing',
      'Cognitive and emotional modulation (cerebellar cognitive affective syndrome)'
    ],
    lesionEffects: {
      motor: 70,
      spatial: 20,
      executive: 15,
      attention: 10,
      language: 10,
      emotion: 15,
      memory: 10,
      visual_perception: 5,
      somatosensory: 10,
      auditory: 5,
    },
    clinicalNotes:
      'Cerebellar damage causes ataxia (uncoordinated movement), dysarthria ' +
      '(slurred speech), intention tremor, and balance problems. Cerebellar ' +
      'cognitive affective syndrome (Schmahmann syndrome) includes executive ' +
      'dysfunction, spatial deficits, and personality changes (Ch.4).',
    color: '#c084fc',
    brodmannAreas: [],
  },

  {
    id: 'cingulate_cortex',
    name: 'Cingulate Cortex (ACC/PCC)',
    position: [0, 0.5, 0.1],
    scale: [0.3, 0.8, 1.0],
    chapters: [10, 11, 12],
    functions: [
      'Conflict monitoring (ACC)', 'Error detection',
      'Pain processing', 'Emotional regulation',
      'Motivational drive', 'Self-referential processing (PCC)'
    ],
    lesionEffects: {
      executive: 50,
      attention: 55,
      emotion: 45,
      motor: 15,
      memory: 20,
      language: 10,
      spatial: 10,
      visual_perception: 5,
      somatosensory: 10,
      auditory: 5,
    },
    clinicalNotes:
      'Anterior cingulate (ACC) is crucial for conflict monitoring and error ' +
      'detection — fires during Stroop interference (Ch.11). ACC damage can cause ' +
      'akinetic mutism and apathy. Posterior cingulate (PCC) is part of the ' +
      'default mode network and involved in self-referential processing (Ch.12).',
    color: '#a78bfa',
    brodmannAreas: [24, 25, 32, 23, 31],
  },

  {
    id: 'corpus_callosum',
    name: 'Corpus Callosum',
    position: [0, 0.4, 0.0],
    scale: [0.4, 0.3, 1.2],
    chapters: [3],
    functions: [
      'Interhemispheric communication',
      'Bilateral motor coordination',
      'Transfer of sensory information between hemispheres'
    ],
    lesionEffects: {
      executive: 30,
      motor: 25,
      language: 25,
      spatial: 20,
      attention: 15,
      memory: 15,
      visual_perception: 15,
      somatosensory: 15,
      emotion: 10,
      auditory: 10,
    },
    clinicalNotes:
      'Callosotomy (split-brain surgery) reveals hemispheric specialization: ' +
      'the left hemisphere cannot report on stimuli presented to the right ' +
      'hemisphere and vice versa. Alien hand syndrome may occur. Split-brain ' +
      'studies by Sperry and Gazzaniga (Ch.3) were foundational to understanding ' +
      'lateralization.',
    color: '#c4b5fd',
    brodmannAreas: [],
  },

  {
    id: 'insula',
    name: 'Insular Cortex',
    position: [-0.7, 0.1, 0.3],
    scale: [0.3, 0.5, 0.5],
    chapters: [12, 13],
    functions: [
      'Interoception (body awareness)', 'Disgust processing',
      'Empathy', 'Pain processing',
      'Taste', 'Autonomic regulation'
    ],
    lesionEffects: {
      emotion: 50,
      somatosensory: 35,
      executive: 15,
      attention: 15,
      memory: 10,
      language: 10,
      auditory: 10,
      motor: 5,
      spatial: 5,
      visual_perception: 5,
    },
    clinicalNotes:
      'Insular damage impairs recognition of disgust in facial expressions and ' +
      'reduces empathic responses (Ch.12, Ch.13). The anterior insula is critical ' +
      'for interoceptive awareness — sensing one\'s own heartbeat, hunger, etc. ' +
      'Important for the subjective feeling component of emotions.',
    color: '#e879f9',
    brodmannAreas: [13, 14, 15, 16],
  },
];


// ── Helper Functions for Brain Data ─────────────────────────

/** Get a brain region by its ID */
export function getRegionById(id: string): BrainRegion | undefined {
  return brainRegions.find((r) => r.id === id);
}

/** Get all regions associated with a given chapter number */
export function getRegionsByChapter(chapter: number): BrainRegion[] {
  return brainRegions.filter((r) => r.chapters.includes(chapter));
}

/** Get all regions that affect a given cognitive domain */
export function getRegionsByDomain(domainId: string): BrainRegion[] {
  return brainRegions.filter(
    (r) => (r.lesionEffects[domainId] ?? 0) > 0
  );
}

/** Calculate combined lesion effects from multiple active lesions.
 *  Uses max-deficit model: for each domain, takes the worst single deficit. */
export function calculateCombinedEffects(
  lesions: { regionId: string; severity: number }[]
): Record<string, number> {
  const combined: Record<string, number> = {};

  for (const lesion of lesions) {
    const region = getRegionById(lesion.regionId);
    if (!region) continue;

    for (const [domain, maxDeficit] of Object.entries(region.lesionEffects)) {
      const scaled = Math.round((lesion.severity / 100) * maxDeficit);
      combined[domain] = Math.max(combined[domain] ?? 0, scaled);
    }
  }

  return combined;
}

/** Get a text summary of what deficits a lesion to a region causes */
export function getLesionSummary(regionId: string, severity: number = 100): string {
  const region = getRegionById(regionId);
  if (!region) return 'Unknown region';

  const domainNames: Record<string, string> = {
    executive: 'Executive Functions',
    language: 'Language',
    memory: 'Memory',
    attention: 'Attention',
    visual_perception: 'Visual Perception',
    spatial: 'Spatial Processing',
    motor: 'Motor Control',
    emotion: 'Emotion & Social',
    somatosensory: 'Somatosensory',
    auditory: 'Auditory Processing',
  };

  const effects = Object.entries(region.lesionEffects)
    .filter(([, val]) => val > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([domain, maxDef]) => {
      const scaled = Math.round((severity / 100) * maxDef);
      return `${domainNames[domain] ?? domain}: -${scaled}%`;
    });

  return effects.join(', ');
}
