import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Table} from '../components/Table';
import {useNavigate} from "react-router-dom";

async function getAccounts() {
    try {
        const response = await fetch('/api/accounts');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching accounts:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return [];
    }
}

async function getItems() {
    try {
        const response = await fetch('/api/items');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching items:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return [];
    }
}


async function getUserItems() {
    try {
        const response = await fetch(`/api/userItems?username=admin`);
        console.log(response)
        if (response.ok) {
            const data = await response.json();

            return data.items.map((item: any) => {
                const {title, year, author, section, tags, ...rest} = item;
                return rest;
            });
        } else {
            console.error('Error fetching user items:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return [];
    }
}


async function getTags() {
    try {
        const response = await fetch('/api/tags');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching tags:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return [];
    }
}

async function getSections() {
    try {
        const response = await fetch('/api/sections');
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error fetching sections:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        return [];
    }
}

export default function AdminPage() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/login', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.loggedIn && data.isAdmin) {
                    console.log('ok');
                } else {
                    navigate("/");
                }
            });
    }, []);

    const [accounts, setAccounts] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [userItems, setUserItems] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);

    const [editRecord, setEditRecord] = useState<any>(null);
    const [editingType, setEditingType] = useState<string | null>(null);
    const [prevRecord, setPrevRecord] = useState<any>(null);

    const [activeTab, setActiveTab] = useState<string>('accounts');
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchData = async () => {
            const accountsData = await getAccounts();
            setAccounts(accountsData);

            const tagsData = await getTags();
            setTags(tagsData);

            const sectionsData = await getSections();
            setSections(sectionsData);

            const userItemsData = await getUserItems();
            setUserItems(userItemsData);

            const itemsData = await getItems();
            setItems(itemsData);
        };

        fetchData();
    }, []);

    const handleDelete = async (record: any, type: string) => {
        console.log(record);

        switch (type) {
            case 'section':
                const sectionId = record.section_id;

                const sectionResponse = await fetch(`/api/sections?itemId=${sectionId}`, {
                    method: 'DELETE',
                });

                if (sectionResponse.ok) {
                    console.log('Section delete saved');
                } else {
                    console.log('Failed to delete section');
                }
                break;

            case 'tag':
                const tagId = record.tag_id;
                const tagResponse = await fetch(`/api/tags?itemId=${tagId}`, {
                    method: 'DELETE',
                });

                if (tagResponse.ok) {
                    console.log('Tag deleted');
                } else {
                    console.log('Failed to delete tag');
                }
                break;

            case 'item':
                console.log(record.item_id);
                const itemId = record.item_id;

                const itemResponse = await fetch(`/api/items?itemId=${itemId}`, {
                    method: 'DELETE',
                });

                if (itemResponse.ok) {
                    console.log('Item deleted');
                } else {
                    console.log('Failed to delete item');
                }
                break;

            case 'account':
                const accountId = record.account_id;

                const accountResponse = await fetch(`/api/accounts?itemId=${accountId}`, {
                    method: 'DELETE',
                });

                if (accountResponse.ok) {
                    console.log('Account deleted saved');
                } else {
                    console.log('Failed to delete account');
                }

                break;

            case 'userItem':
                const userItemId = record.user_item_id;
                const userItemResponse = await fetch(`/api/userItems?itemId=${userItemId}`, {
                    method: 'DELETE',
                });

                if (userItemResponse.ok) {
                    console.log('User item deleted');
                } else {
                    console.log('Failed to delete user item');
                }
                break;

            default:
                console.error('Unknown editing type:', type);
                break;
        }
        window.location.reload();

    };

    const handleEdit = (record: any, type: string) => {
        if (!prevRecord) {
            setPrevRecord(record);
        }

        setEditRecord(record);
        setEditingType(type);
    };

    const handleSaveEdit = async () => {
        if (editRecord) {
            console.log('Saving edited record:', editRecord);

            const data = {
                oldRecord: prevRecord,
                newRecord: editRecord,
            };

            try {
                switch (editingType) {
                    case 'section':
                        const sectionResponse = await fetch('/api/sections', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });

                        const sectionResult = await sectionResponse.json();

                        if (sectionResponse.ok) {
                            console.log('Section update saved');
                        } else {
                            console.error('Failed to save section update:', sectionResult?.message || sectionResult);
                        }
                        break;

                    case 'tag':
                        const tagResponse = await fetch('/api/tags', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });

                        const tagResult = await tagResponse.json();

                        if (tagResponse.ok) {
                            console.log('Tag update saved');
                        } else {
                            console.log('Failed to save tag update', tagResult?.message || tagResult);
                        }
                        break;

                    case 'item':
                        const itemResponse = await fetch('/api/items', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });

                        const itemResult = await itemResponse.json();

                        if (itemResult.ok) {
                            console.log('Tag update saved');
                        } else {
                            console.log('Failed to save tag update');
                        }
                        break;

                    case 'account':
                        let accountResponse = null;
                        if (data.oldRecord.username != data.newRecord.username) {
                            accountResponse = await fetch('/api/accounts', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            });
                            const accountResult = await accountResponse.json();

                            if (accountResponse.ok) {
                                console.log('Account update saved');
                            } else {
                                console.log('Failed to save account update', accountResult?.message || accountResult);
                            }
                            break;
                        }

                        if (data.oldRecord.first_name != data.newRecord.first_name || data.oldRecord.last_name != data.newRecord.last_name) {
                            accountResponse = await fetch('/api/users', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            });
                            const accountResult = await accountResponse.json();

                            if (accountResponse.ok) {
                                console.log('User update saved');
                            } else {
                                console.log('Failed to save user update', accountResult?.message || accountResult);
                            }
                            break;
                        }

                        break;

                    case 'userItem':
                        console.log(data)
                        const userItemResponse = await fetch('/api/updateItems', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });

                        const userItemResult = await userItemResponse.json();

                        if (userItemResult.ok) {
                            console.log('Item update saved');
                        } else {
                            console.log('Failed to save item update');
                        }
                        break;

                    default:
                        console.error('Unknown editing type:', editingType);
                        break;
                }
            } catch (error) {
                console.error('Error during saving section:', error);
            }


            setEditRecord(null);
            setEditingType(null);
            window.location.href = "/admin"
        }
    };

    const handleCancelEdit = () => {
        setPrevRecord(null);
        setEditRecord(null);
        setEditingType(null);
    };

    const transformedAccountData = accounts.map(account => ({
        ...account,
        Actions: (
            <span className='flex space-x-4'>
                <button
                    onClick={() => {
                        const { account_id, ...accountWithoutId } = account;
                        handleEdit(accountWithoutId, 'account');
                    }}
                    className={'px-4 py-2 bg-[var(--green)] text-white rounded-md hover:bg-[var(--green-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'}
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(account, 'account')}
                    className={'px-4 py-2 bg-[var(--red)] text-white rounded-md hover:bg-[var(--red-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300'}
                >
                    Delete
                </button>
            </span>
        ),
    }));

    const transformedTagsData = tags.map(tag => ({
        ...tag,
        Actions: (
            <span className='flex space-x-4'>
                <button
                    onClick={() => {
                        const { tag_id, ...tagWithoutId } = tag;
                        handleEdit(tagWithoutId, 'tag');
                    }}
                    className={'px-4 py-2 bg-[var(--green)] text-white rounded-md hover:bg-[var(--green-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'}
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(tag, 'tag')}
                    className={'px-4 py-2 bg-[var(--red)] text-white rounded-md hover:bg-[var(--red-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300'}
                >
                    Delete
                </button>
            </span>
        ),
    }));

    const transformedSectionsData = sections.map(section => ({
        ...section,
        Actions: (
            <span className='flex space-x-4'>
                <button
                    onClick={() => {
                        const { section_id, ...sectionWithoutId } = section;
                        handleEdit(sectionWithoutId, 'section');
                    }}
                    className={'px-4 py-2 bg-[var(--green)] text-white rounded-md hover:bg-[var(--green-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'}
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(section, 'section')}
                    className={'px-4 py-2 bg-[var(--red)] text-white rounded-md hover:bg-[var(--red-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300'}
                >
                    Delete
                </button>
            </span>
        ),
    }));

    const transformedUserItemsData = userItems.map(item => ({
        ...item,
        Actions: (
            <span className='flex space-x-4'>
                <button
                    onClick={() => {
                        const { id, item_id, account_id, ...itemWithoutId } = item;
                        console.log('itemmm', item, itemWithoutId)
                        handleEdit(itemWithoutId, 'userItem');
                    }}
                    className={'px-4 py-2 bg-[var(--green)] text-white rounded-md hover:bg-[var(--green-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'}
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(item, 'userItem')}
                    className={'px-4 py-2 bg-[var(--red)] text-white rounded-md hover:bg-[var(--red-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300'}
                >
                    Delete
                </button>
            </span>
        ),
    }));

    const transformedItemsData = items.map(item => ({
        ...item,
        Actions: (
            <span>
                <button
                    onClick={() => {
                        const { item_id, ...itemWithoutId } = item;
                        handleEdit(itemWithoutId, 'item');
                    }}
                    className={'px-4 py-2 bg-[var(--green)] text-white rounded-md hover:bg-[var(--green-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'}
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(item, 'item')}
                    className={'px-4 py-2 bg-[var(--red)] text-white rounded-md hover:bg-[var(--red-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300'}
                >
                    Delete
                </button>
            </span>
        ),
    }));

    const accountColumns = accounts.length > 0 ? [...Object.keys(accounts[0]).filter(key => key !== 'account_id'), 'Actions'] : [];
    const tagColumns = tags.length > 0 ? [...Object.keys(tags[0]).filter(key => key !== 'tag_id'), 'Actions'] : [];
    const sectionColumns = sections.length > 0 ? [...Object.keys(sections[0]).filter(key => key !== 'section_id'), 'Actions'] : [];
    const userItemColumns = userItems.length > 0 ? [...Object.keys(userItems[0]).filter(key => key !== 'id'), 'Actions'] : [];
    const itemColumns = items.length > 0 ? [...Object.keys(items[0]).filter(key => key !== 'item_id'), 'Actions'] : [];

    const renderEditForm = () => {
        if (!editRecord || !editingType) return null;

        let formFields = Object.keys(editRecord).map((key) => ({
            label: key.replace(/_/g, ' ').toUpperCase(),
            oldValue: prevRecord[key],
            newValue: editRecord[key],
            field: key,
        }));

        return (
            <form>
                <table className={'min-w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden'}>
                    <thead className={'bg-[var(--clr-surface-tonal-a10)]'}>
                    <tr className={'bg-[var(--clr-surface-tonal-a10)]'}>
                        <th className={'px-4 py-2 text-left font-semibold border-b'}>Original Value</th>
                        <th className={'px-4 py-2 text-left font-semibold border-b'}>Updated Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {formFields.map((field: any) => (
                        <tr key={field.field}>
                            <td className={'px-4 py-2 border-b'}>
                                <p>{field.oldValue}</p>
                            </td>
                            <td className={'px-4 py-2 border-b'}>
                                <input
                                    type='text'
                                    value={field.newValue}
                                    onChange={(e) => {
                                        setEditRecord((prevRecord: any) => ({
                                            ...prevRecord,
                                            [field.field]: e.target.value,
                                        }));
                                    }}
                                    className={'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className={'form-actions mt-4 flex space-x-4 justify-end'}>
                    <button
                        type='button'
                        onClick={handleCancelEdit}
                        className={'px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300'}
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSaveEdit}
                        className={'px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300'}
                    >
                        Save
                    </button>
                </div>
            </form>
        );
    };


    return (
        <>
            <Helmet/>
            <div className={'p-6 space-y-8'}>
                <div className={'flex space-x-4 border-b pb-4'}>
                    <button
                        onClick={() => handleTabClick('accounts')}
                        className={`px-4 py-2 text-lg font-semibold ${activeTab === 'accounts' ? 'border-b-2 border--600' : ''}`}
                    >
                        Manage Accounts
                    </button>
                    <button
                        onClick={() => handleTabClick('tags')}
                        className={`px-4 py-2 text-lg font-semibold ${activeTab === 'tags' ? 'border-b-2 border--600' : ''}`}
                    >
                        Manage Tags
                    </button>
                    <button
                        onClick={() => handleTabClick('sections')}
                        className={`px-4 py-2 text-lg font-semibold ${activeTab === 'sections' ? 'border-b-2 border--600' : ''}`}
                    >
                        Manage Sections
                    </button>
                    <button
                        onClick={() => handleTabClick('items')}
                        className={`px-4 py-2 text-lg font-semibold ${activeTab === 'items' ? 'border-b-2 border--600' : ''}`}
                    >
                        Manage Items
                    </button>
                    <button
                        onClick={() => handleTabClick('userItems')}
                        className={`px-4 py-2 text-lg font-semibold ${activeTab === 'userItems' ? 'border-b-2 border--600' : ''}`}
                    >
                        Manage Users Items
                    </button>
                </div>

                <div className='mt-6'>
                    {activeTab === 'accounts' && (
                        <div className={'bg-white shadow-md rounded-lg overflow-hidden'}>
                            <Table data={transformedAccountData} columns={accountColumns}/>
                        </div>
                    )}

                    {activeTab === 'tags' && (
                        <div className={'bg-white shadow-md rounded-lg overflow-hidden'}>
                            <Table data={transformedTagsData} columns={tagColumns}/>
                        </div>
                    )}

                    {activeTab === 'sections' && (
                        <div className={'bg-white shadow-md rounded-lg overflow-hidden'}>
                            <Table data={transformedSectionsData} columns={sectionColumns}/>
                        </div>
                    )}

                    {activeTab === 'items' && (
                        <div className={'bg-white shadow-md rounded-lg overflow-hidden'}>
                            <Table data={transformedItemsData} columns={itemColumns}/>
                        </div>
                    )}

                    {activeTab === 'userItems' && (
                        <div className={'bg-white shadow-md rounded-lg overflow-hidden'}>
                            <Table data={transformedUserItemsData} columns={userItemColumns}/>
                        </div>
                    )}
                </div>

                <br/>
                {renderEditForm()}
            </div>
        </>
    );
}
