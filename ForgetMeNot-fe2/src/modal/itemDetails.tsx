import React, {useEffect, useState} from "react";
import {Modal} from "./modal.tsx";
import SearchBar from "../components/Searchbar.tsx";
import {Slider} from "../components/Slider.tsx";
interface ItemDetailsPageProps {
    username: string,
    data: any;
    onClose: () => void,
}

const ItemDetailsPage: React.FC<ItemDetailsPageProps> = ({username, data, onClose}) => {
    const [filteredSections, setFilteredSections] = useState<any[]>([]);
    const [filteredTag, setFilteredTag] = useState<string[]>([]);

    const [storyValue, setStoryValue] = useState<number>(0);
    const [visualValue, setVisualValue] = useState<number>(0);
    const [endingValue, setEndingValue] = useState<number>(0);
    const [ratingValue, setRatingValue] = useState((storyValue + visualValue + endingValue) / 3);
    const [selectedCategory, setSelectedCategory] = useState<"knihy" | "filmy">("knihy");
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [section, setSection] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [favouriteParts, setFavouriteParts] = useState<string>("");
    const [lastChapter, setLastChapter] = useState<string>("");
    const [lastMinute, setLastMinute] = useState<string>("");
    const [done, setDone] = useState(false);
    const [tag, setTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [year, setYear] = useState<string>();
    const [id, setId] = useState<number>();
    const [publicItem, setPublicItem] = useState<boolean>(false);

    // const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    useEffect(() => {
        if (data) {
            setId(data.id)
            setTitle(data.title || "");
            setAuthor(data.author || "");
            setLink(data.link || "");
            setSection(data.section || "");
            setNotes(data.notes || "");
            setFavouriteParts(data.favourite_parts || "");
            setLastChapter(data.last_chapter || "");
            setLastMinute(data.last_minute || "");
            setDone(data.done || false);
            setTags(data.tags || []);
            setYear(data.year || "");
            setPublicItem(data.public || false);
            setSelectedCategory(data.selected_category || "knihy");
            setStoryValue(data.story_rating || 0);
            setVisualValue(data.scenery_rating || 0);
            setEndingValue(data.ending_rating || 0);
        }
    }, [data]);

    useEffect(() => {
        const newAverage = storyValue + visualValue + endingValue;
        setRatingValue(newAverage);
        filterSections("Kniha");
    }, [storyValue, visualValue, endingValue]);

    const handleDoneChange = (value: boolean) => {
        setDone(value);
    };

    const filterSections = (type: string | null = null) => {
        setFilteredSections(
            type ? filteredSections.filter(section => section.section_type === type).map(section => section.name)
                : filteredSections.map(section => section.name)
        );
    };

    const handleAddTag = () => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        // setTag("");
    };
    const handleRemoveTag = (removeTag: string) => {
        setTags(tags.filter(t => t !== removeTag));
    };

    const handleDelete = async (itemId:string) => {
        if (!itemId) {
            console.error("ItemAccount ID is missing.");
            return;
        }

        try {
            const response = await fetch(`/api/userItems?itemId=${itemId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to delete item:", errorData.error);
                return;
            }

            console.log(`Deleted item with ID: ${itemId}`);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };
    const handleSave = async () => {
        const data = {
            id,
            username,
            title,
            author,
            year,
            selectedCategory,
            lastMinute,
            lastChapter,
            done,
            link,
            section,
            tags,
            notes,
            favouriteParts,
            storyValue,
            visualValue,
            endingValue,
            publicItem
        };

        console.log(id)

        if (!title || !author) {
            console.log('Title or author not set:');
            return;
        }

        try {
            console.log(JSON.stringify(data));

            const response = await fetch('/api/userItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Data saved successfully:', result);
                onClose()
            } else {
                console.error('Failed to save data:', response.status);
            }
        } catch (error) {
            console.error('Error occurred while saving data:', error);
        }
    };

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
                    className={`btn btn--special ${selectedCategory === "knihy" ? "btn--focus" : ""}`}
                    onClick={() => {
                        setSelectedCategory("knihy");
                        filterSections("Kniha");
                    }}
                >
                    Knihy
                </button>
                <button
                    className={`btn btn--special ${selectedCategory === "filmy" ? "btn--focus" : ""}`}
                    onClick={() => {
                        setSelectedCategory("filmy");
                        filterSections("Film");
                    }}
                >
                    Filmy a seriály
                </button>
            </div>

            <div className="grid grid-cols-3 justify-between mb-3">
                <div className="flex flex-col w-full gap-6 sm:w-auto">
                    <div>
                        Názov:
                        <input
                            className="p-2 mt-1 w-full sm:w-auto"
                            type="text"
                            placeholder="Enter Názov"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        /></div>
                    {selectedCategory === "knihy" ? (
                        <div>Autor:</div>) : (
                        <div>Réžia:</div>)}
                    <input
                        className="p-2 mt-1 w-full sm:w-auto"
                        type="text"
                        placeholder="Enter Autor"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <div>
                        Odkaz:
                        <input
                            className="p-2 mt-1 w-full sm:w-auto"
                            type="text"
                            placeholder="Enter Odkaz"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        /></div>
                    <div className="flex flex-wrap gap-5 justify-between">
                        <div>
                            Sekcia:
                            <SearchBar url={'sections'} setSuggestions={setSection} placeholder={section}/>
                        </div>
                    </div>
                </div>

                <div>
                    <p>Tagy:</p>
                    <SearchBar
                        url="tags"
                        setSuggestions={(value) => {
                            const newSuggestion = typeof value === "function" ? value("") : value;

                            if (
                                newSuggestion &&
                                !filteredTag.includes(newSuggestion) &&
                                !tags.includes(newSuggestion)
                            ) {
                                setFilteredTag((prev) => [...prev, newSuggestion]);
                                setTag(newSuggestion);
                                handleAddTag()
                            }
                        }}
                    />

                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center px-3 py-1 rounded-lg shadow-md bg-gray-200 dark:bg-neutral-600"
                            >
                                <span className="mr-2">#{tag}</span>
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="bg-red-600 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div>
                        Rok:
                        <input
                            className="p-2 mt-1 w-full sm:w-auto"
                            type="text"
                            placeholder={year || "Enter Rok"}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center w-full sm:w-auto">
                    <div className="flex flex-col gap-2 mb-5">
                        {selectedCategory === "knihy" ? (
                            <div>Dočítané:</div>
                        ) : (
                            <div>Dopozerané:</div>
                        )}
                        <div className={'flex'}>
                            <div>
                                <button
                                    className={`btn btn--special ${done ? "btn--focus" : ""}`}
                                    onClick={() => handleDoneChange(true)}
                                >
                                    Áno
                                </button>
                            </div>
                            <div>
                                <button
                                    className={`btn btn--special ${done ? "" : "btn--focus"}`}
                                    onClick={() => handleDoneChange(false)}
                                >
                                    Nie
                                </button>
                            </div>
                        </div>
                    </div>

                    <img className="w-[15vw] rounded-xl mt-3 mb-3" alt="sdf" src="src/assets/book-icon.svg"/>
                </div>
            </div>

            <div className="flex flex-col gap-3 mb-5">
                {selectedCategory === "knihy" ? (
                    <div>
                        Posledná kapitola:
                        <input
                            className="p-2 mt-1 w-full sm:w-auto"
                            type="text"
                            placeholder={lastChapter || "Enter Posledne videné"}
                            value={lastChapter}
                            onChange={(e) => setLastChapter(e.target.value)}
                        /></div>) : (
                    <div>
                        Posledná epizóda / minúta:
                        <input
                            className="p-2 mt-1 w-full sm:w-auto"
                            type="text"
                            placeholder={lastMinute || "Enter Posledne videné"}
                            value={lastMinute}
                            onChange={(e) => setLastMinute(e.target.value)}
                        /></div>)}
                <>
                    <div>Obľúbené časti:</div>
                    <textarea
                        className="p-2 mt-1 w-full"
                        placeholder={favouriteParts || "Enter your casti"}
                        rows={4}
                        value={favouriteParts}
                        onChange={(e) => setFavouriteParts(e.target.value)}
                    ></textarea>
                </>

                <>
                    <div>Poznámky:</div>
                    <textarea
                        className="p-2 mt-1 w-full"
                        placeholder={notes || "Enter your Poznámky"}
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </>
            </div>

            <div className="w-[70%] mb-3">
                <Slider min={0} max={5} step={1} value={storyValue} onChange={setStoryValue} label={"Dej"}/>
                {selectedCategory === "knihy" ? (
                    <Slider min={0} max={5} step={1} value={visualValue} onChange={setVisualValue}
                            label={"Ilustrácia"}/>
                ) : (
                    <Slider min={0} max={5} step={1} value={visualValue} onChange={setVisualValue} label={"Vizuál"}/>
                )}
                <Slider min={0} max={5} step={1} value={endingValue} onChange={setEndingValue} label={"Záver"}/>
                <Slider min={0} max={15} step={1} value={ratingValue} onChange={setRatingValue}
                        label={"Celkové hodnotenie"} disabled/>
            </div>

            <div className="flex justify-between">
                <button className="btn btn--special" onClick={() => handleDelete(data.id)}>Vymaž</button>
                <button className={`btn btn--special ${publicItem ? "btn--focus" : ""}`}
                        onClick={() => setPublicItem((publicItem) => !publicItem)}>Verejné
                </button>
                <button className="btn btn--special" onClick={handleSave}>Ulož</button>
            </div>
        </div>
    );
};

export const ItemDetails = ({username, data, isOpen, onClose}: {
    isOpen: boolean,
    onClose: () => void,
    username: string,
    data: any,
}) => {
    if (!isOpen || data === undefined) return null;

    return (
        <Modal onClose={onClose}>
            <ItemDetailsPage username={username} data={data} onClose={onClose}/>
        </Modal>
    );
};