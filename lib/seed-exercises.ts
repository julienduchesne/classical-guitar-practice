import type { Exercise } from "./types";

export const SEED_EXERCISES: Exercise[] = [
  // Right Hand (Arpeggios & Tone)
  { id: "1", name: "Giuliani #1 (p-i-m)", category: "right_hand", focus: "Basic thumb/finger coordination" },
  { id: "2", name: "Giuliani #2 (p-m-i)", category: "right_hand", focus: "Reverse arpeggio pattern" },
  { id: "3", name: "Giuliani #3 (p-i-m-a-m-i)", category: "right_hand", focus: "Extended arpeggio flow" },
  { id: "4", name: "Planting Drill", category: "right_hand", focus: "Speed/accuracy by pre-planting fingers" },
  { id: "5", name: "Rest Stroke vs Free Stroke", category: "right_hand", focus: "Alternating on a single string" },
  { id: "6", name: "Thumb Independence", category: "right_hand", focus: "Playing a melody with thumb while fingers hold a chord" },
  { id: "7", name: "Tremolo Prep", category: "right_hand", focus: "p-a-m-i on a single string (slowly)" },
  // Left Hand (Strength & Agility)
  { id: "8", name: "The Spider (1-2-3-4)", category: "left_hand", focus: "Basic finger independence across strings" },
  { id: "9", name: "The Spider (Diagonal)", category: "left_hand", focus: "Finger 1 on String 6, Finger 2 on String 5, etc." },
  { id: "10", name: "Hammer-ons (Ascending Slurs)", category: "left_hand", focus: "Building strength in fingers 3 and 4" },
  { id: "11", name: "Pull-offs (Descending Slurs)", category: "left_hand", focus: "Accuracy and flicking motion" },
  { id: "12", name: "Fixed Finger Drills", category: "left_hand", focus: "Hold fingers 1 & 2 while 3 & 4 move" },
  { id: "13", name: "Horizontal Shifts", category: "left_hand", focus: "Sliding a single finger from Fret 1 to Fret 12 accurately" },
  { id: "14", name: "Barre Squeeze & Release", category: "left_hand", focus: "Building stamina without hand cramping" },
  // Coordination & Scales
  { id: "15", name: "C Major (Segovia Fingering)", category: "coordination_scales", focus: "Basic 2-octave fluency" },
  { id: "16", name: "A Minor Melodic", category: "coordination_scales", focus: "Understanding scale variations" },
  { id: "17", name: "Chromatic Scale (Full Neck)", category: "coordination_scales", focus: "Synchronization of both hands" },
  { id: "18", name: "Double Stops (3rds)", category: "coordination_scales", focus: "Playing scales in intervals of thirds" },
  { id: "19", name: "Double Stops (6ths)", category: "coordination_scales", focus: "Playing scales in intervals of sixths" },
  { id: "20", name: "String Crossing Drill", category: "coordination_scales", focus: "i-m alternation while jumping non-adjacent strings" },
  // Specialized Technique
  { id: "21", name: "Vibrato Pulse", category: "specialized", focus: "Developing a relaxed, wide vibrato" },
  { id: "22", name: "Natural Harmonics", category: "specialized", focus: "Precision at 12th, 7th, and 5th frets" },
  { id: "23", name: "Pizzicato (Palm Mute)", category: "specialized", focus: "Thumb accuracy with palm damping" },
  { id: "24", name: "Descending Arpeggio", category: "specialized", focus: "Speed on treble strings" },
  { id: "25", name: "Rest Stroke Scales", category: "specialized", focus: "Developing volume and punch in melodies" },
];
