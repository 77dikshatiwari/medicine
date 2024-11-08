import React, { useState } from 'react'
import { useContext } from 'react';
import {AuthContent} from '../context/AuthContent.jsx';
import axios from 'axios';
import Loader from './Loader.jsx';

const InputForm = ({setGeneratedContent}) => {
    const [medicineName, setMedicineName] = useState('');
    const [loading, setLoading] = useState(false);
    const {user} = useContext(AuthContent) 
    const api_url = import.meta.env.VITE_API_URL;

    const handleGenerate = async () => {
        if(!medicineName.trim()){
            return;
        }
        setLoading(true);
        try {
            console.log('Generating content for', medicineName);
            const response = await axios.post(`${api_url}/ai/generate`, {medicineName});
            const generatedContent = response.data.content;
            console.log('Generated content:', generatedContent);
            setGeneratedContent(medicineName, generatedContent);
            setMedicineName('');
            if(user){
                const token = localStorage.getItem('token');
                if(token){
                    await axios.post(`${api_url}/ai/generate`, {medicineName, content: generatedContent}, 
                        {headers: {Authorization: `Bearer ${token}`}})
                        console.log('Content saved to server');
                }
                else{
                    console.log('User is not logged in and no token found, content not saved');
                }
            }
        } catch (error) {
            if(error.response){
                console.error(`Failed to generate content`, error.response.data.message);
            }else{
                console.error(`Error generating content: ${error.message}`);
            }
            
        } finally{
            setLoading(false);
        }
    }
  return (
    <>
     <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg p-5 transition-all z-50">
        <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-grow px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter a medicine name..."
            disabled={loading}
          />
          <button
            className="px-4 py-3 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>
      <Loader loading={loading} /> 
    </>
  )
}

export default InputForm
