"use client"

import Image from "next/image";

import { useRef, useState } from "react";
import astrounaut from '../assets/astronaut.png';
import send from '../assets/send.svg';
import load from '../assets/loading.gif';
import loadBtn from '../assets/loading-btn.gif';
import { TypeAnimation } from "react-type-animation";
import Markdown from 'markdown-to-jsx'




export default function Home() {

  const [historyChat, setHistoryChat]: any[] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }


  const handleSubmitQuestion = (question: string) => {
    if (question.toLocaleLowerCase().includes('siapa nana')) {
      setHistoryChat([...historyChat, {
        question,
        answer: 'Nana Handre Saputra adalah seorang yang paling kece badai abad ini, ketampanan dan kharisma nya yang sangat luar biasa mantapp menjadikan dia termasuk kedalam deretan orang-orang kece 2025 di dunia. Anjaaayyy!!!'
      }])
      setInputMessage('');
      scrollToBottom();
    } else {
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
  }




  return (
    <section className="py-8 px-5 lg:px-12 relative max-w-[100vw] overflow-hidden">

      {historyChat.length > 0 ? (
        <div className="max-h-[78vh] md:max-h-[85vh] overflow-y-auto lg:pt-10 rounded-lg " id="chat" >

          <div className="flex justify-center w-full rounded-b-full">
            <div className="absolute z-10 top-0 w-screen h-[20vh] md:w-10/12 md:h-[25vh] lg:h-[35vh] rounded-b-full bg-purple-500 opacity-30 blur-3xl" />
          </div>

          <div className="mb-[18vh] md:mb-[24vh] lg:mb-[30vh] relative z-50 ">
            {historyChat.map((data, index) => (
              <div className="space-y-2 mt-2" key={index} >
                <div className="flex justify-end">
                  <p className="bg-purple-600 rounded-lg p-3 text-white text-xs md:text-sm max-w-[22rem] md:max-w-[30rem] lg:max-w-[50rem]">{`${data.question}`}</p>
                </div>
                <div className="flex justify-start" style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                  {/* <p className="bg-gray-500 rounded-lg p-3 text-white max-w-[17rem] md:max-w-[30rem] lg:max-w-[50rem]" >{`${data.answer}`}</p> */}
                  <Markdown className="bg-gray-700 rounded-lg p-3 text-white text-xs md:text-sm max-w-[22rem] md:max-w-[30rem] lg:max-w-[50rem] overflow-auto" >{data.answer}</Markdown>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} className="" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full relative">
          <div className="h-[20rem] w-[30rem] lg:h-[30rem] lg:w-[30rem] bg-purple-600 blur-3xl rounded-full opacity-35" />
          <Image src={astrounaut} alt="astronaut" className="absolute w-32 h-32 md:h-40 md:w-40 animate-bounce " />
          <TypeAnimation
            preRenderFirstString={true}
            sequence={[
              'Hello 👋 Welcome to Nn-Next AI',
              2500,
              '', //  Continuing previous Text
              500,

            ]}
            speed={50}
            style={{ fontSize: '2vmax', fontWeight: 'bold' }}
            repeat={Infinity}
          />
        </div>
      )
      }

      <div className="fixed bottom-12 w-full space-y-3">

        {isLoading && (
          <div className="flex justify-center items-center space-y-1 w-10/12 bg-[#0a0a0a]  ">
            <Image src={load} alt="send" className="w-12 h-12" />
            <p className="animate-pulse font-semibold">Generate ...</p>
          </div>
        )}

        <form className="flex md:justify-center items-center space-x-2 md:space-x-4 w-full" onSubmit={(e) => {
          e.preventDefault()
          handleSubmitQuestion(inputMessage)
        }} >
          <input type="search" autoComplete='off' name="serch" placeholder="Question" id="input-value" className="bg-white h-10 px-5 w-9/12 md:w-7/12 text-black pr-10 rounded-full text-sm focus:outline-none" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} ></input>
          <button disabled={isLoading} className="bg-white rounded-full py-2 px-3 md:px-5" type="submit" >
            {isLoading ? <Image src={loadBtn} alt="send" className="w-5 h-5" /> : <Image src={send} alt="send" className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </section>
  );
}
