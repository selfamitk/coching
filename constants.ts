import { Curriculum } from './types';

// Mock curriculum data to structure the app navigation
export const CURRICULUM: Curriculum = {
  'Class 10': {
    subjects: [
      { id: 'math', name: 'Mathematics', icon: 'Calculator' },
      { id: 'science', name: 'Science', icon: 'FlaskConical' },
      { id: 'social', name: 'Social Science', icon: 'Globe' },
      { id: 'english', name: 'English', icon: 'BookOpen' },
    ],
    topics: {
      'math': [
        { id: 'real-numbers', name: 'Real Numbers', description: 'Euclid’s division lemma, Fundamental Theorem of Arithmetic.' },
        { id: 'polynomials', name: 'Polynomials', description: 'Zeros of a polynomial, Relationship between zeros and coefficients.' },
        { id: 'trigonometry', name: 'Introduction to Trigonometry', description: 'Trigonometric ratios, identities, and heights/distances.' },
        { id: 'stats', name: 'Statistics', description: 'Mean, median, and mode of grouped data.' },
      ],
      'science': [
        { id: 'chemical-reactions', name: 'Chemical Reactions', description: 'Types of chemical reactions, balancing equations.' },
        { id: 'electricity', name: 'Electricity', description: 'Ohm’s law, resistance, series and parallel circuits.' },
        { id: 'life-processes', name: 'Life Processes', description: 'Nutrition, respiration, transportation, and excretion.' },
        { id: 'light', name: 'Light - Reflection & Refraction', description: 'Spherical mirrors, lenses, and refractive index.' },
      ],
      'social': [
        { id: 'nationalism-india', name: 'Nationalism in India', description: 'The First World War, Khilafat and Non-Cooperation.' },
        { id: 'resources', name: 'Resources and Development', description: 'Types of resources, land utilization, and soil types.' },
        { id: 'federalism', name: 'Federalism', description: 'What is federalism, key features, and federalism in India.' },
      ],
      'english': [
        { id: 'letter-god', name: 'A Letter to God', description: 'A story about deep faith in God.' },
        { id: 'nelson-mandela', name: 'Nelson Mandela: Long Walk to Freedom', description: 'Autobiographical extract about the inauguration ceremony.' },
        { id: 'grammar', name: 'Grammar & Writing', description: 'Tenses, Modals, Subject-verb concord, Letter writing.' },
      ]
    }
  },
  'Class 12': {
    subjects: [
      { id: 'physics', name: 'Physics', icon: 'Atom' },
      { id: 'chemistry', name: 'Chemistry', icon: 'FlaskRound' },
      { id: 'math', name: 'Mathematics', icon: 'Sigma' },
      { id: 'cs', name: 'Computer Science', icon: 'Cpu' },
    ],
    topics: {
      'physics': [
        { id: 'electrostatics', name: 'Electrostatics', description: 'Electric charges, fields, potential, and capacitance.' },
        { id: 'optics', name: 'Ray & Wave Optics', description: 'Reflection, refraction, interference, diffraction.' },
        { id: 'semiconductors', name: 'Semiconductor Electronics', description: 'Diodes, transistors, logic gates.' },
      ],
      'chemistry': [
        { id: 'solutions', name: 'Solutions', description: 'Types of solutions, Raoult’s law, Colligative properties.' },
        { id: 'electrochemistry', name: 'Electrochemistry', description: 'Redox reactions, Nernst equation, Conductance.' },
        { id: 'organic', name: 'Haloalkanes and Haloarenes', description: 'Nomenclature, methods of preparation, physical and chemical properties.' },
      ],
      'math': [
        { id: 'calculus', name: 'Calculus', description: 'Continuity, Differentiability, Integrals, Differential Equations.' },
        { id: 'vectors', name: 'Vectors & 3D Geometry', description: 'Vector algebra, lines and planes in 3D space.' },
        { id: 'probability', name: 'Probability', description: 'Conditional probability, Bayes’ theorem.' },
      ],
      'cs': [
        { id: 'python', name: 'Python Revision Tour', description: 'Review of Python basics, loops, and functions.' },
        { id: 'sql', name: 'Database Management', description: 'SQL commands, joins, and interface with Python.' },
        { id: 'networks', name: 'Computer Networks', description: 'Network types, devices, protocols, and security.' },
      ]
    }
  }
};
