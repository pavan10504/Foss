import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Flag, CheckCircle2, Loader, User, Clock, ListTodo, Focus } from "lucide-react";
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger,} from "@/components/ui/tooltip";
import { useTheme } from "../components/theme";
import { useUser } from "@clerk/clerk-react";

const IntegratedRoadmap = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [pathProgress, setPathProgress] = useState(0);
  const { darkMode } = useTheme();
  const [resultgenerated, setResult] = React.useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.firstName) return;
    const cacheKey = `resultgenerated${user.firstName}`;
    const cachedResults = localStorage.getItem(cacheKey);
    if (cachedResults) {
      setResult(JSON.parse(cachedResults));
    }
  }, [user?.firstName]);

  const sampleData = resultgenerated.roadmap;

  const calculateTotalNodes = useCallback(() => {
    if (!sampleData?.learningPlan) return 0;
    return (
      1 + // Starting point
      (sampleData.learningPlan.shortTerm?.checkpoints?.length || 0) +
      1 + // Short-term goals
      (sampleData.learningPlan.longTerm?.checkpoints?.length || 0) +
      2 // Long-term goals + Final achievement
    );
  }, [sampleData]);

  const generatePath = useCallback(() => {
    setIsGenerating(true);
    setAnimationPhase(0);
    setPathProgress(0);

    const totalNodes = calculateTotalNodes();
    const animationDuration = 800;
    let currentPhase = 0;

    const interval = setInterval(() => {
      currentPhase += 1;
      setAnimationPhase(currentPhase);
      setPathProgress((currentPhase / totalNodes) * 100);
      
      if (currentPhase >= totalNodes) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, animationDuration);

    return () => clearInterval(interval);
  }, [calculateTotalNodes]);
  const Milestone = ({ visible, text, icon: Icon, color, metadata = null, isMainNode = false, position = "right" }) => (
    <div className={`flex items-center transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'} 
      ${isMainNode ? 'justify-center' : position === 'right' ? 'justify-start ml-[50%] pl-8' : 'justify-end mr-[50%] pr-8'}`}>
      {position === 'left' && !isMainNode && (
        <span className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium mr-4">
          {text}
        </span>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={`bg-white p-2 rounded-full shadow-md border-2 ${color} 
              ${isMainNode ? 'z-10' : ''}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
          </TooltipTrigger>
          {metadata && (
            <TooltipContent className="w-64">
              <Card className="border-0 shadow-none">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold">{text}</h4>
                  {metadata.timeline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{metadata.timeline}</span>
                    </div>
                  )}
                  {metadata.focus && (
                    <div className="flex items-center gap-2 text-sm">
                      <Focus className="w-4 h-4" />
                      <span>{metadata.focus}</span>
                    </div>
                  )}
                  {metadata.actions && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <ListTodo className="w-4 h-4" />
                        <span>Actions:</span>
                      </div>
                      <ul className="text-sm pl-6 list-disc">
                        {metadata.actions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {metadata.milestones && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Flag className="w-4 h-4" />
                        <span>Milestones:</span>
                      </div>
                      <ul className="text-sm pl-6 list-disc">
                        {metadata.milestones.map((milestone, idx) => (
                          <li key={idx}>{milestone}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {position === 'right' && !isMainNode && (
        <span className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium ml-4">
          {text}
        </span>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Learning Path</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {sampleData?.studentBasics && [
                    { title: "Strengths", items: sampleData.studentBasics.strengths, color: "text-blue-600" },
                    { title: "Improvements", items: sampleData.studentBasics.improvements, color: "text-red-600" },
                    { title: "Goals", items: sampleData.studentBasics.goals, color: "text-green-600" }
                  ].map(({ title, items, color }) => (
                    <div key={title}>
                      <h3 className={`font-semibold ${color}`}>{title}</h3>
                      <ul className="mt-2 space-y-1">
                        {items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${color.replace('text', 'bg')} rounded-full`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={generatePath}
              disabled={isGenerating || !sampleData}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Roadmap"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

       {sampleData && (
        <div className="relative w-full bg-gray-50 rounded-lg shadow-inner p-8 min-h-[800px]">
          <div className="absolute left-1/2 top-[40px] bottom-[40px] w-1 bg-gray-200 transform -translate-x-1/2" />
          <div 
            className="absolute left-1/2 top-[40px] bottom-[40px] w-1 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500 transition-all duration-1000 transform -translate-x-1/2"
            style={{ height: `${pathProgress}%` }}
          />
          
          <div className="relative grid gap-16 py-10">
        
        <div className="relative grid gap-16 py-10">
          <Milestone 
            visible={animationPhase >= 1}
            icon={Award}
            text="Starting Point : Learning Plan"
            color="text-blue-600"
            isMainNode={true}
            metadata={{
                
            }}
          />

          {sampleData?.learningPlan?.shortTerm?.checkpoints?.map((checkpoint, idx) => (
            <Milestone 
              key={idx}
              visible={animationPhase >= idx + 2}
              icon={CheckCircle2}
              text={checkpoint}
              color="text-gray-600"
              position={idx % 2 === 0 ? 'right' : 'left'}
            />
          ))}

          <Milestone 
            visible={animationPhase >= sampleData?.learningPlan?.shortTerm?.checkpoints?.length + 2}
            icon={Target}
            text="Short-Term Goals"
            color="text-blue-500"
            isMainNode={true}
            metadata={{
              timeline: sampleData?.learningPlan?.shortTerm.timeline,
              focus: sampleData?.learningPlan?.shortTerm.focus,
              actions: sampleData?.learningPlan?.shortTerm.actions
            }}
          />

          {sampleData?.learningPlan?.longTerm?.checkpoints.map((checkpoint, idx) => (
            <Milestone 
              key={idx}
              visible={animationPhase >= idx + sampleData?.learningPlan?.shortTerm?.checkpoints.length + 3}
              icon={CheckCircle2}
              text={checkpoint}
              color="text-gray-600"
              position={idx % 2 === 0 ? 'right' : 'left'}
            />
          ))}

          <Milestone 
            visible={animationPhase >= sampleData?.learningPlan?.shortTerm?.checkpoints.length + 
                                    sampleData?.learningPlan?.longTerm?.checkpoints.length + 3}
            icon={Target}
            text="Long-Term Goals"
            color="text-green-500"
            isMainNode={true}
            metadata={{
              timeline: sampleData?.learningPlan?.longTerm.timeline,
              focus: sampleData?.learningPlan?.longTerm.focus,
              actions: sampleData?.learningPlan?.longTerm.actions
            }}
          />

          <Milestone 
            visible={animationPhase >= calculateTotalNodes()}
            icon={Flag}
            text="Final Achievement"
            color="text-yellow-500"
            isMainNode={true}
            metadata={{
              timeline: sampleData?.studentBasics?.timeline,
              focus: sampleData?.studentBasics?.focus,
              actions: sampleData?.studentBasics?.actions
            }}
          />
        </div>
      </div>
        </div>
      )}
      </div>
  );
};

export default IntegratedRoadmap;