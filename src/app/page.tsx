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
  const bottomRef = useRef<any>(null);

  const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }


  const handleSubmitQuestion = (question: string) => {
    scrollToBottom(bottomRef);
    if (question.toLocaleLowerCase().includes('siapa nana')) {
      setHistoryChat([...historyChat, {
        question,
        answer: 'Nana Handre Saputra adalah seorang yang paling kece badai abad ini, ketampanan dan kharisma nya yang sangat luar biasa mantapp menjadikan dia termasuk kedalam deretan orang-orang kece 2025 di dunia. Anjaaayyy!!!'
      }])
      setInputMessage('');
      scrollToBottom(messagesEndRef);
    } else {
      setIsLoading(true);

      setInputMessage('');

      fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyApbdgzoCvjFLksDx5OhYr3rK4XhLmDa3g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: historyChat.length > 0 ? [...historyChat.map((data) => ([{ role: 'user', parts: [{ text: data.question }] }, { role: 'model', parts: [{ text: data.answer }] }])).flatMap(data => [...data]), { role: 'user', parts: [{ text: question }] }] : [{
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
        scrollToBottom(messagesEndRef);
        setIsLoading(false)
      });
    }
  }






  return (
    <section className="py-8 relative max-w-[100vw] overflow-hidden">

      {historyChat.length > 0 ? (
        <div className=" px-5 lg:px-12 max-h-[78vh] md:max-h-[85vh] overflow-y-auto lg:pt-10 rounded-lg " id="chat" >

          <div className="flex justify-center w-full rounded-b-full">
            <div className="absolute z-10 top-0 w-screen h-[40vh] lg:w-10/12 md:h-[50vh] lg:h-[60vh] rounded-b-full bg-gradient-to-b from-purple-600 to-[#0a0a0a] opacity-30 blur-3xl" />
          </div>

          <div className="mb-[18vh] md:mb-[24vh] lg:mb-[30vh] relative z-30 ">
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
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="pb-5 px-5 lg:px-12 flex flex-col items-center justify-center w-full relative">
          <div className="h-[20rem] w-[30rem] lg:h-[30rem] lg:w-[30rem] bg-gradient-to-b from-purple-600 to-[#0a0a0a] blur-3xl rounded-full opacity-35" />
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

      <div className="fixed bottom-0 pb-12 flex flex-col items-center w-screen z-50 space-y-3 bg-[#0a0a0a]">

        {isLoading && (
          <div className="flex justify-center items-center space-y-1 w-10/12 ">
            <Image src={load} alt="send" className="w-12 h-12" />
            <p className="animate-pulse font-semibold">Generate ...</p>
          </div>
        )}

        <form className="flex w-full justify-center items-center space-x-2 md:space-x-4" ref={bottomRef} onSubmit={(e) => {
          e.preventDefault()
          handleSubmitQuestion(inputMessage)
        }} >
          <input autoComplete='off' name="serch" placeholder="Question" id="input-value" className="bg-white h-10 px-5 w-9/12 md:w-7/12 text-black pr-10 rounded-full text-sm focus:outline-none" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} ></input>
          <button disabled={isLoading} className="bg-white rounded-full py-2 px-3 md:px-5" type="submit" >
            {isLoading ? <Image src={loadBtn} alt="send" className="w-5 h-5" /> : <Image src={send} alt="send" className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </section>
  );
}
