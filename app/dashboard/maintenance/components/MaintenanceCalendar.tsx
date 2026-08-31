import FullCalendar from "@fullcalendar/react";
import {EventContentArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {Badge, Card, Flex, Heading, Text} from "@radix-ui/themes";
import {MaintenanceItem} from "@/lib/types";

interface MaintenanceCalendarProps {
    items: MaintenanceItem[];
    onSelectItem: (item: MaintenanceItem) => void;
}

const priorityToColor: Record<MaintenanceItem["priority"], "gray" | "orange" | "red"> = {
    Low: "gray",
    Medium: "orange",
    High: "red"
};

function buildEventTitle(item: MaintenanceItem) {
    return `${item.unitCode} · ${item.type}`;
}

function renderEventContent(content: EventContentArg) {
    const event = content.event;
    const priority = event.extendedProps.priority as MaintenanceItem["priority"];
    const title = event.extendedProps.maintenanceTitle as string;

    return (
        <Flex direction="column" gap="1">
            <Text size="1" weight="medium" className="truncate">
                {event.title}
            </Text>
            <Text size="1" className="truncate">
                {title}
            </Text>
            <Badge variant="soft" color={priorityToColor[priority]} size="1">
                {priority}
            </Badge>
        </Flex>
    );
}

export function MaintenanceCalendar({items, onSelectItem}: MaintenanceCalendarProps) {
    const events: EventInput[] = items.map((item) => ({
        id: item.id,
        title: buildEventTitle(item),
        start: item.scheduledFor ?? undefined,
        end: item.scheduledUntil ?? undefined,
        allDay: false,
        extendedProps: {
            maintenanceTitle: item.title,
            priority: item.priority,
            item
        }
    }));

    return (
        <Card>
            <Flex direction="column" gap="3">
                <Heading size="4">Maintenance Calendar</Heading>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,listWeek"
                    }}
                    buttonText={{
                        today: "Today",
                        month: "Month",
                        week: "Week",
                        list: "List"
                    }}
                    events={events}
                    eventContent={renderEventContent}
                    eventClick={(info) => {
                        const item = info.event.extendedProps.item as MaintenanceItem;
                        onSelectItem(item);
                    }}
                    height="auto"
                    firstDay={1}
                    nowIndicator
                    displayEventTime
                />
            </Flex>
        </Card>
    );
}
