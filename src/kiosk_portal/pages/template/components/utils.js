
import moment from 'moment';

export const createdBySelect = [
    {
        label: 'Admin',
        value: 'server'
    },
    {
        label: 'Me',
        value: 'local'
    }
]
export const eventStatusSelect = [
    {
        label: 'On going',
        value: 'on going'
    },
    {
        label: 'Upcoming',
        value: 'coming soon'
    },
    {
        label: 'End',
        value: 'end'
    }
]
export const responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];
export const itemTemplate = (item) => {
    return <div >
        <img src={item.itemImageSrc}
            style={{ width: '473px', height: '300px', display: 'block' }}
        />
    </div>;
}
export const thumbnailTemplate = (item) => {
    return <div style={{ marginTop: 15 }}>
        <img src={item.thumbnailImageSrc}
            style={{ width: 20, height: 20, display: 'block' }}
        />
    </div>
}

export const removeItemFromList = (id, list) => {
    const removeIndex = []
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            removeIndex.push(i);
        }
    }
    for (let index of removeIndex) {
        list.splice(index, 1)
    }
    return list
}

export const getComponentFromList = (id, list) => {
    for (let component of list) {
        if (component.id == id) {
            return component;
        }
    }
    return {};
}
export const reorderKeysOfObject = (component) => {
    return Object.keys(component).sort().reduce(
        (obj, key) => {
            obj[key] = component[key];
            return obj;
        },
        {}
    );
}
export const createEventModel = (event) => {
    let imgs = [];
    if (event.listImage !== undefined && event.listImage.length != 0)
        event.listImage.map(img => imgs.push(img.link));
    let data = {
        id: event.id,
        name: event.name,
        thumbnail: event.thumbnail.link,
        description: event.description,
        time: moment(event.timeStart).format('DD/MM/YYYY HH:mm') + " - "
            + moment(event.timeEnd).format('DD/MM/YYYY HH:mm'),
        address: event.address + ' - ' + event.ward + ', ' + event.district + ', ' + event.city,
        type: event.type,
        status: event.status,
        listImage: imgs,
    }
    return data;
}
export const buildPositionsModelRequest = (components, templateId, type) => {
    let listPosition = [];
    Object.entries(components).map((element, index) => {
        if (index !== 0) {
            let component = element[1];
            for (let i = 0; i < component.length; i++) {
                let position;
                if (type === 'event') {
                    position = {
                        eventId: component[i].id,
                        rowIndex: index - 1,
                        columnIndex: i
                    };
                }
                else {
                    position = {
                        appCategoryId: component[i].id,
                        rowIndex: index - 1,
                        columnIndex: i
                    };
                }
                listPosition.push(position);
            }
        }
    }
    );
    let request = {
        templateId: templateId,
        listPosition: listPosition
    }
    return request;
}

