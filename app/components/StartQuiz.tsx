import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuizCategory } from "../types/quiz";
import { motion } from "framer-motion";
import {
  Code,
  Database,
  Globe,
  HardDrive,
  Layout,
  Terminal,
} from "lucide-react";
import type React from "react";

interface StartQuizProps {
  onStart: (category: QuizCategory) => void;
}

const categories: Array<{
  name: QuizCategory;
  icon: React.ReactNode;
  description: string;
  color: string;
}> = [
  {
    name: "Linux",
    icon: <Terminal className="w-6 h-6" />,
    description: "Master the command line",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "DevOps",
    icon: <HardDrive className="w-6 h-6" />,
    description: "CI/CD and automation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Docker",
    icon: <Globe className="w-6 h-6" />,
    description: "Containerization expertise",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "SQL",
    icon: <Database className="w-6 h-6" />,
    description: "Database management",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "CMS",
    icon: <Layout className="w-6 h-6" />,
    description: "Content management",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Code",
    icon: <Code className="w-6 h-6" />,
    description: "Programming concepts",
    color: "from-yellow-500 to-orange-500",
  },
];

export default function StartQuiz({ onStart }: StartQuizProps) {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Choose Your Path</CardTitle>
        <CardDescription className="text-lg">
          Select a category to begin your quiz journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ name, icon, description, color }) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => onStart(name)}
            >
              <Card className="h-full overflow-hidden relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div
                      className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br ${color} text-white`}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
