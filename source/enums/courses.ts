import { Assignment } from './../types/assignment';
const courses = [
    {
        codegradeId: 3711,
        name: 'Inleiding tot Programmeren - G, L & T',
        chapters: [
            {
                number: "01", name: "Sequentie", file: "seqssuence", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "02", name: "Selectie deel 1", file: "selection-part-1", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "03", name: "Selectie deel 2", file: "selection-part-2", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "04", name: "For loop", file: "for-loop", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "05", name: "Do while", file: "do-while", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "06", name: "While do", file: "while-do", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "07", name: "Collecties", file: "collections", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "08", name: "Methodes", file: "methods", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "09", name: "Stringmethodes", file: "stringmethods", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },
            {
                number: "10", name: "Bestanden", file: "files", assignments: [] as Assignment[],
                mandatoryAssignments: ["01", "02", "03", "04", "05",]
            },]
    }
]

export default courses;