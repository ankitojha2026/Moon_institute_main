import { Card, CardContent } from "@/components/ui/card";

const TopStudentsSection = () => {
  const topStudents = [
    { name: "Radheshyam", class: "Class 9th", roll: "1682", subjects: ["Math: 58", "Sci: 52", "Stu: 58"] },
    { name: "Shalini", class: "Class 10th", roll: "1547", subjects: ["Math: 92", "Sci: 88", "Eng: 85"] },
    { name: "Krishna", class: "Class 11th", roll: "1234", subjects: ["Math: 89", "Phy: 85", "Che: 87"] },
    { name: "Priya", class: "Class 12th", roll: "1123", subjects: ["Math: 95", "Phy: 92", "Che: 90"] },
    { name: "Amit", class: "Class 9th", roll: "1456", subjects: ["Math: 85", "Sci: 82", "Stu: 88"] },
    { name: "Neha", class: "Class 10th", roll: "1345", subjects: ["Math: 88", "Sci: 85", "Eng: 90"] },
    { name: "Rahul", class: "Class 11th", roll: "1567", subjects: ["Math: 92", "Phy: 88", "Che: 85"] },
    { name: "Anjali", class: "Class 12th", roll: "1678", subjects: ["Math: 90", "Phy: 87", "Che: 89"] },
    { name: "Vikram", class: "Class 9th", roll: "1789", subjects: ["Math: 82", "Sci: 85", "Stu: 80"] },
    { name: "Sneha", class: "Class 10th", roll: "1890", subjects: ["Math: 87", "Sci: 90", "Eng: 88"] }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">TOP 10 STUDENTS</h2>
          <p className="text-lg text-gray-600">
            Celebrating our academic achievers and their outstanding performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {topStudents.map((student, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-primary'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.class}</p>
                    <p className="text-xs text-gray-500">Roll No: {student.roll}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {student.subjects.map((subject, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-primary text-white text-xs rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStudentsSection;
