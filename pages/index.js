import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// import scrolls from "../styles/Scrolls.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  };
  return (
    <div>
    
    <div height="100vh" className="subpixel-antialiased bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
      <div className="container mx-auto py-10 border-solid">
        <Head>
          <title>FLAMINGO AI ASSITANT</title>
        </Head>
        <div className="gradient-box" height="100vh">
          <h1 className="text-5xl font-bold text-center text-pink-300 mb-8">
            ASK FLAMINGO ANYTHING{" "}
          </h1>
          <p className="text-2xl text-center text-aqua-600 mb-4">
            <a href="https://replicate.com/22-hours/vintedois-diffusion/versions/28cea91bdfced0e2dc7fda466cc0a46501c0edc84905b2120ea02e0707b967fd">
              XRMIAMI Presents
            </a>
          </p>
          <form className="flex flex-col items-center  w-full text-slate-900" onSubmit={handleSubmit}>
            <input
            
              type="text"
              name="prompt"
              placeholder="Enter a prompt to display an image"
              className="form-input mb-5 p-5 rounded-lg text-center"
            />
            <button type="submit" className="btn">
              Generate 
            </button>
          </form>

          {error && <div className="text-red-500 mt-4">{error}</div>}

          {prediction && (
            <div className="mt-8 text-center">
              {prediction.output && (
                <div className="imageWrapper">
                  <Image
                    
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    sizes="100%"
                    width="640"
                    height="640"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxWidth: '75vh', maxHeight: '640px' }}
                  />
                <div className="scrolls"></div>

                </div>
                
              )}
              <p className="text-lg mt-4">status: {prediction.status}</p>
            </div>
          )}
        </div>
      </div>
        
    </div>
    <footer><p className="text-center">ⓩⓔⓝ {new Date().getFullYear()}XR R&D by Gennaro</p></footer>
    </div>
  );
}