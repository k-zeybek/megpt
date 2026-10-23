import { useState } from 'react'
import './App.css'

type ButtonProps = {
  onNext?: boolean
  onPrevious?: boolean
   currentStage: number
   setCurrentStage: (stage: number) => void
}

function Buttons({ onNext = true, onPrevious = true, currentStage, setCurrentStage }: ButtonProps) {
  return (
    <div className="flex flex-row justify-between min-w-3/4 gap-4">
      {onPrevious && (
      <button 
        onClick={() => setCurrentStage(currentStage - 1)}
        className="next-btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mr-auto">Previous</button>
      )}
      {onNext && (
      <button 
        onClick={() => setCurrentStage(currentStage + 1)}
        className="next-btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-auto">Next</button>
      )}
    </div>
  )
}

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);


  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('megpt_api_key') || '';
  });

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
    alert('Please enter a valid API key.');
    return;
    }

    try {
      const response = await fetch('https://localhost:8000/api/set_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ api_key: apiKey })
      });

      if (response.ok) {
        localStorage.setItem('megpt_api_key', apiKey);
        setCurrentStage(2);
      } else {
        const errorData = await response.json();
        alert(`Error from server: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Could not connect to the Python backend.');
    }
  }

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-stretch">
      
      {/*Header*/}
      <div>
        <h1 className="text-3xl font-bold">MeGPT 😊</h1>
      </div>
      
      {/*Stage 0*/}
      {currentStage === 0 && (
        <div className="flex-1 flex flex-col justify-between min-h-[80vh] gap-4">
          <div className="grow">
            <h3 className="text-red-500 text-xl font-semibold">Disclaimer</h3>
            <p className="mt-2">For the functions of this software, certain things are required:</p>
            <ul className="mt-4 space-y-2 list-none pl-0">
              <li>1. An API key to any AI service <br />
                <span className="text-sm text-gray-500">(If you don't have one, you can make one with the steps provided later)</span>
              </li>
              <li>2. Messages data (obviously)</li>
              <li>3. Some of your input / evaluation</li>
            </ul>
          </div>
          <Buttons 
            onPrevious={false} 
            currentStage={currentStage} 
            setCurrentStage={setCurrentStage} 
          />  
        </div>
      )}
        
        {/*Stage 1*/}
        {currentStage === 1 && (
          <div className="flex-1 flex flex-col justify-between min-h-[80vh] gap-4 items-center">
            <div className="grow flex-col flex max-w-1/2 items-center justify-center">
              <div className="mt-16 flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-2">Enter an API Key:</h3>
                <input
                className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                ></input>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4 w-full"
                  onClick={() => handleSaveApiKey()}
                >Submit</button>
              </div>
              <div className="grow"></div>
            </div>
            <Buttons
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
            />
          </div>
        )}
    </div>
  )
}