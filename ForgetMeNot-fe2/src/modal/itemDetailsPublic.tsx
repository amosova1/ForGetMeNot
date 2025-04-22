import {Modal} from "./modal.tsx";
import React, {useState} from "react";
import {Slider} from "../components/Slider.tsx";
import bookIcon from '../assets/book-icon.svg';

interface ItemDetailsPageProps {
    data: any;
}

const ItemDetailsPublicPage: React.FC<ItemDetailsPageProps> = ({data}) => {
    console.log('here', data);
    const [storyValue] = useState<number>(data.story_rating);
    const [visualValue] = useState<number>(data.scenery_rating);
    const [endingValue] = useState<number>(data.ending_rating);
    const [ratingValue] = useState((storyValue + visualValue + endingValue) / 3);
    const [selectedCategory] = useState<"Kniha" | "Film">(data.type);
    const [title] = useState<string>(data.title);
    const [author] = useState<string>(data.author);
    const [link] = useState<string>(data.link);
    const [section] = useState<string>(data.section);
    const [notes] = useState<string>(data.notes);
    const [favouriteParts] = useState<string>(data.favourite_parts);
    const [lastChapter] = useState<string>(data.last_chapter);
    const [lastMinute] = useState<string>(data.last_minute);
    const [done] = useState(data.done);
    // const [tag, setTag] = useState<string>(data.tag);
    const [tags] = useState<string[]>(data.tags);
    const [year] = useState<string>(data.year);

    return (
        <div className="w-[50vw] h-[70vh] overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-grey-200
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
            <div className="flex gap-1 mb-5">
                <button
                    className={`btn btn--special ${selectedCategory === "Kniha" ? "btn--focus" : ""}`}
                >
                    Knihy
                </button>
                <button
                    className={`btn btn--special ${selectedCategory === "Film" ? "btn--focus" : ""}`}
                >
                    Filmy a seriály
                </button>
            </div>

            <div className="grid grid-cols-3 justify-between mb-3">
                <div className="flex flex-col w-full gap-6 sm:w-auto">
                    <div> Názov: {title}</div>
                    {selectedCategory === "Kniha" ? (
                        <div>Autor: </div>) : (
                        <div>Réžia: </div>)} {author}
                    <div>
                        Odkaz: {link}</div>
                    <div className="flex flex-wrap gap-5 justify-between">
                        <div>
                            Sekcia: {section}
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex flex-col justify-around sm:w-auto">
                        <div>
                            <p>Tagy:</p>
                            {/*<form onSubmit={handleAddTag}>*/}
                            {/*    <input*/}
                            {/*        className="p-2 mt-1 w-full sm:w-auto border rounded"*/}
                            {/*        type="text"*/}
                            {/*        placeholder="Enter Tag"*/}
                            {/*        value={''}*/}
                            {/*    />*/}
                            {/*</form>*/}

                            <div className="flex flex-wrap gap-2 mt-4 mb-4">
                                {tags.map((tag, index) => (
                                    <div key={index}
                                         className="flex items-center px-3 py-1 rounded-lg shadow-md w-fit">
                                        <span className="mr-2">#{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            Rok: {year}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center w-full sm:w-auto">
                    <div className="flex flex-col gap-2 mb-5">
                        {selectedCategory === "Kniha" ? (
                            <div>Dočítané:</div>
                        ) : (
                            <div>Dopozerané:</div>
                        )}
                        <div className={'flex'}>
                            <div>
                                <button
                                    className={`btn btn--special ${done ? "btn--focus" : ""}`}
                                >
                                    Áno
                                </button>
                            </div>
                            <div>
                                <button
                                    className={`btn btn--special ${done ? "" : "btn--focus"}`}
                                >
                                    Nie
                                </button>
                            </div>
                        </div>
                    </div>

                    <img className="w-[15vw] rounded-xl mt-3 mb-3" alt="sdf" src={bookIcon}/>
                </div>
            </div>

            <div className="flex flex-col gap-3 mb-5">
                {selectedCategory === "Kniha" ? (
                    <div>
                        Posledná kapitola: {lastChapter}
                    </div>) : (
                    <div>
                        Posledná epizóda / minúta:
                        {lastMinute}</div>)}
                <>
                    <div>Obľúbené časti:</div>
                    {favouriteParts}
                </>

                <>
                    <div>Poznámky:</div>
                    {notes}
                </>
            </div>

            <div className="w-[70%] mb-3">
                <Slider min={0} max={5} step={1} value={storyValue} label={"Dej"} disabled/>
                {selectedCategory === "Kniha" ? (
                    <Slider min={0} max={5} step={1} value={visualValue}
                            label={"Ilustrácia"} disabled/>
                ) : (
                    <Slider min={0} max={5} step={1} value={visualValue} label={"Vizuál"} disabled/>
                )}
                <Slider min={0} max={5} step={1} value={endingValue} label={"Záver"} disabled/>
                <Slider min={0} max={15} step={1} value={ratingValue}
                        label={"Celkové hodnotenie"} disabled/>
            </div>
        </div>
    );
};

export const ItemDetailsPublic = ({data, isOpen, onClose}: {
    isOpen: boolean,
    onClose: () => void,
    data: any,
}) => {
    if (!isOpen || data === undefined) return null;

    return (
        <Modal onClose={onClose}>
            <ItemDetailsPublicPage data={data}/>
        </Modal>
    );
};