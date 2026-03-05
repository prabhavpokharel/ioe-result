/**
 * data.js — Static data constants for IOE Result Calculator
 * Old system: BCE, BCT, BEI (batch 2079 and before)
 * New system: All 12 BE/B.Arch programs (batch 2080+)
 */

const OP = {
  BCT: { l: "BCT", f: "Computer Engineering",           s: [725,650,875,900,875,825,825,750] },
  BCE: { l: "BCE", f: "Civil Engineering",               s: [675,700,700,750,875,750,750,650] },
  BEI: { l: "BEI", f: "Electronics, Comm. & Info.",      s: [775,750,700,775,775,825,775,675] }
};

const NP = {
  BCT:  { l: "BCT",    f: "Computer Engineering" },
  BCE:  { l: "BCE",    f: "Civil Engineering" },
  BEI:  { l: "BEI",    f: "Electronics, Comm. & Info." },
  BEL:  { l: "BEL",    f: "Electrical Engineering" },
  BME:  { l: "BME",    f: "Mechanical Engineering" },
  BAG:  { l: "BAG",    f: "Agriculture Engineering" },
  BGE:  { l: "BGE",    f: "Geomatics Engineering" },
  BIE:  { l: "BIE",    f: "Industrial Engineering" },
  BAU:  { l: "BAU",    f: "Automobile Engineering" },
  BAS:  { l: "BAS",    f: "Aerospace Engineering" },
  BChE: { l: "BChE",   f: "Chemical Engineering" },
  BAR:  { l: "B.Arch", f: "Architecture (10 sems)" }
};

// Semester names (0-indexed)
const SEM_NAMES = [
  "First","Second","Third","Fourth",
  "Fifth","Sixth","Seventh","Eighth",
  "Ninth","Tenth"
];

// Year per semester (1-indexed year, 0-indexed semester)
const SEM_YEAR = [1,1,2,2,3,3,4,4];

// Year weights for aggregate calculation
const YEAR_WEIGHTS = [0.20, 0.20, 0.30, 0.30];

// Year accent colours — sky, gold, sage, mist
const YEAR_COLORS = ["#3a6e96","#a07832","#5c7d6a","#6a5e8c"];
const YEAR_BG     = ["#d8eaf5","#f0e6d2","#dce8e1","#e8e4f5"];

// Division thresholds — old percentage system
const DIVISIONS = [
  { k:"dist", l:"Distinction",     t:80, c:"#3e5c4a", bg:"#dce8e1", bc:"rgba(62,92,74,.3)",   bar:"#5c7d6a" },
  { k:"1st",  l:"First Division",  t:65, c:"#2a5278", bg:"#d8eaf5", bc:"rgba(42,82,120,.3)",  bar:"#3a6e96" },
  { k:"2nd",  l:"Second Division", t:50, c:"#7a5c1a", bg:"#f0e6d2", bc:"rgba(122,92,26,.3)",  bar:"#a07832" },
  { k:"pass", l:"Pass",            t:40, c:"#7a3a28", bg:"#f5e0da", bc:"rgba(122,58,40,.3)",  bar:"#b85440" },
  { k:"fail", l:"Fail",            t:0,  c:"#6a2c20", bg:"#fde8e4", bc:"rgba(106,44,32,.3)",  bar:"#b85440" },
];

// GPA standings — new system
const GPA_STANDINGS = [
  { k:"exc", l:"Excellent",         t:3.7, c:"#3e5c4a", bg:"#dce8e1", bc:"rgba(62,92,74,.3)",   bar:"#5c7d6a" },
  { k:"vg",  l:"Very Good",         t:3.3, c:"#2a5278", bg:"#d8eaf5", bc:"rgba(42,82,120,.3)",  bar:"#3a6e96" },
  { k:"gd",  l:"Good",              t:3.0, c:"#7a5c1a", bg:"#f0e6d2", bc:"rgba(122,92,26,.3)",  bar:"#a07832" },
  { k:"st",  l:"Satisfactory",      t:2.0, c:"#7a3a28", bg:"#f5e0da", bc:"rgba(122,58,40,.3)",  bar:"#b85440" },
  { k:"ni",  l:"Needs Improvement", t:0,   c:"#6a2c20", bg:"#fde8e4", bc:"rgba(106,44,32,.3)",  bar:"#b85440" },
];
