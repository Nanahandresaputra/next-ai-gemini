"use client"

import Image from "next/image";

import { useRef, useState } from "react";
import astrounaut from '../assets/astronaut.png';
import send from '../assets/send.svg';
import load from '../assets/loading.gif';
import loadBtn from '../assets/loading-btn.gif';
import { TypeAnimation } from "react-type-animation";



export default function Home() {

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [historyChat, setHistoryChat]: any[] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  const handleSubmitQuestion = (question: string) => {
    setIsLoading(true);

    setInputMessage('');

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyApbdgzoCvjFLksDx5OhYr3rK4XhLmDa3g', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: question
          }]
        }],
      })
    }).then((res) => {
      return res.json();
    }).then((res) => {
      setHistoryChat([...historyChat, {
        question,
        answer: res.candidates[0].content.parts[0].text
      }])
    }).catch(() => { }).finally(() => {
      scrollToBottom();
      setIsLoading(false)
    });
  }


  return (
    <section className="p-8 col-span-6 relative">

      {historyChat.length > 0 ? (
        <div className="max-h-[85vh] overflow-y-auto pt-10" id="chat" >
          {historyChat.map((data, index) => (
            <div className="space-y-2 mt-2" key={index} >
              <div className="flex justify-end">
                <p className="bg-purple-600 rounded-lg p-3 text-white text-right max-w-[50rem]">{`${data.question}`}</p>
              </div>
              <div className="flex justify-start">
                <p className="bg-gray-500 rounded-lg p-3 text-white text-start max-w-[50rem]">{`${data.answer}`}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} className="pt-4 mt-[30vh]" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center items-center w-full relative">
          <div className="h-[30rem] w-[30rem] bg-purple-600 blur-3xl rounded-full opacity-35" />
          <Image src={astrounaut} alt="astronaut" className="absolute h-40 w-40 animate-bounce " />
          <TypeAnimation
            preRenderFirstString={true}
            sequence={[
              'Hello 👋 Welcome to Biassjomok AI',
              2500,
              '', //  Continuing previous Text
              500,

            ]}
            speed={50}
            style={{ fontSize: '2em', fontWeight: 'bold' }}
            repeat={Infinity}
          />
        </div>
      )
      }

      <div className="fixed bottom-10 w-full space-y-3 ">

        {isLoading && (
          <div className="flex justify-center items-center space-y-1 w-10/12 bg-[#0a0a0a]  ">
            <Image src={load} alt="send" className="w-12 h-12" />
            <p className="animate-pulse font-semibold">Generate ...</p>
          </div>
        )}

        <form className="flex items-center space-x-4 w-full" onSubmit={(e) => {
          e.preventDefault()
          handleSubmitQuestion(inputMessage)
        }} >
          <input type="search" name="serch" placeholder="Question" id="input-value" className="bg-white h-10 px-5 w-9/12 text-black pr-10 rounded-full text-sm focus:outline-none" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} ></input>
          <button disabled={isLoading} className="bg-white rounded-full py-2 px-5" type="submit" >
            {isLoading ? <Image src={loadBtn} alt="send" className="w-5 h-5" /> : <Image src={send} alt="send" className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </section>
  );
}
