import {useEffect, useState} from 'react';
import {Item} from "../components/Item";
import SearchBar from "../components/Searchbar";
import {ItemDetailsPublic} from "../modal/itemDetailsPublic";

async function getSections() {
    try {
        const response = await fetch('/api/sections');

        if (response.ok) {
            const data = await response.json();

            const sectionsList: { name: string; section_type: string }[] = data.map((section: any) => ({
                name: section.name || section.section_name,
                section_type: section.section_type || "unknown",
            }));
            console.log(sectionsList);
            return sectionsList;
        } else {
            console.error('Error fetching sections:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return [];
    }
}

async function getItems(username: string) {
    console.log('getItems', username);
    const getResponse = await fetch(`/api/userItems?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (getResponse.ok) {
        const itemsData = await getResponse.json();
        console.log('Fetched items:', itemsData);

        return itemsData;
    } else {
        const errorData = await getResponse.json();
        console.error('Error fetching items:', errorData.message);
        return [];
    }
}

export default function Home() {
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [sectionsList, setSectionsList] = useState<{ name: string; section_type: string }[]>([]);
    const [filteredSections, setFilteredSections] = useState<{ name: string; section_type: string }[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [filteredAuthor, setFilteredAuthor] = useState<string>("");
    const [filteredTag, setFilteredTag] = useState<string>("");
    const [filteredSection, setFilteredSection] = useState<string>("");
    const [userItems, setUserItems] = useState<any[]>([]);

    useEffect(() => {
        getSections().then((data) => {
            setSectionsList(data);
            setFilteredSections(data);
        });

        getItems('public').then((data) => {
            setUserItems(data.items);
            setFilteredItems(data.items);
        });

    }, []);

    useEffect(() => {
        if (filteredAuthor === '') {
            setFilteredItems(userItems);
        } else {
            setFilteredItems(userItems.filter(item => item.author === filteredAuthor));
        }
    }, [filteredAuthor]);

    useEffect(() => {
        if (filteredTag === '') {
            setFilteredItems(userItems);
        } else {
            setFilteredItems(userItems.filter(item => item.tags.includes(filteredTag)));
        }
    }, [filteredTag]);

    useEffect(() => {
        if (filteredSection === '') {
            setFilteredItems(userItems);
        } else {
            setFilteredItems(userItems.filter(item => item.section === filteredSection));
        }
    }, [filteredSection]);

    const closeItem = () => {
        setSelectedItem(null);
    }

    const filterItemsAll = () => {
        setFilteredSections(sectionsList);
        setFilteredItems(userItems);
    }
    const filterItemsBooks = () => {
        setFilteredSections(sectionsList.filter(section => section.section_type === "Kniha"));
        setFilteredItems(userItems.filter(item => item.type === "knihy"));
    }

    const filterItemsFilms = () => {
        setFilteredSections(sectionsList.filter(section => section.section_type === "Film"));
        setFilteredItems(userItems.filter(item => item.type === "filmy"));
    }

    return (
        <div className={'flex flex-col'}>
            <div className={'w-full flex justify-between mb-3'}>
                <div>
                    <button className={'btn btn--special'} onClick={filterItemsBooks}>
                        Knihy
                    </button>

                    <button className={'btn btn--special'} onClick={filterItemsFilms}>
                        Filmy & Seriály
                    </button>

                    <button className={'btn btn--special'} onClick={filterItemsAll}>
                        Všetky
                    </button>
                </div>
            </div>

            <div className={'flex'}>
                <div className={'flex flex-col w-[20%] h-full gap-5 items-center text-center'}>

                    <button className={'content_filter hover:font-semibold transition-colors duration-300'} onClick={()=> setFilteredSection('')}>
                        Filtrovanie
                    </button>

                    <div className={'flex flex-wrap gap-3 justify-center'}>
                        {filteredSections.length > 0 ? (
                            filteredSections.map((section, index) => (
                                <button key={index}
                                        className={'hover:font-semibold transition-colors duration-300'}
                                     onClick={()=> setFilteredSection(section.name)}
                                >
                                    {section.name}
                                </button>
                            ))
                        ) : (
                            <div>Žiadne dostupné sekcie</div>
                        )}
                    </div>

                    <div className={'border pl-3 pr-3 w-[80%]'}></div>

                    <div className={''}>
                        Autor:
                    </div>

                    <div className={'w-[80%]'}>
                        <SearchBar url={'authors'} setSuggestions={setFilteredAuthor}/>
                    </div>

                    <div className={'border pl-3 pr-3 w-[80%]'}></div>

                    <div className={'content_filter'}>
                        Tagy:
                    </div>

                    <div className={'w-[80%]'}>
                        <SearchBar url={'tags'} setSuggestions={setFilteredTag}/>
                    </div>
                </div>

                <div className={'flex flex-wrap w-[80%] h-full mt-25 gap-7'}>
                    {userItems.length > 0 ? (
                        filteredItems.map((item: any, index) => (
                            <Item
                                data={item}
                                key={index}
                                number={index + 1}
                                onClick={() => setSelectedItem(item)}
                                publicItem={true}
                            />
                        ))
                    ) : (
                        <div>No items found.</div>
                    )}

                    {selectedItem !== null && (
                        <ItemDetailsPublic
                            data={selectedItem}
                            isOpen={true}
                            onClose={() => closeItem()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
