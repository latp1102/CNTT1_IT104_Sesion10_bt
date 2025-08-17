class Passenger {
    private static idCounter = 1;
    passengerId: number;
    name: string;
    passportNumber: string;

    constructor(name: string, passportNumber: string) {
        this.passengerId = Passenger.idCounter++;
        this.name = name;
        this.passportNumber = passportNumber;
    }
    getDetails(): string {
        return `ID: ${this.passengerId}, Name: ${this.name}, Passport: ${this.passportNumber}`;
    }
}

abstract class Flight {
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: Date;
    capacity: number;
    bookedSeats: number = 0;

    constructor(flightNumber: string, origin: string, destination: string, departureTime: Date, capacity: number) {
        this.flightNumber = flightNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.capacity = capacity;
    }
    bookSeat(): void {
        if (!this.isFull()) {
            this.bookedSeats++;
        } 
    }
    isFull(): boolean {
        return this.bookedSeats >= this.capacity;
    }
    abstract calculateBaggageFee(weight: number): number;
}
class DomesticFlight extends Flight {
    calculateBaggageFee(weight: number): number {
        return weight * 50000; 
    }
}
class InternationalFlight extends Flight {
    calculateBaggageFee(weight: number): number {
        return weight * 10 * 25000; 
    }
}

class Booking {
    private static bookingCounter = 1;
    bookingId: number;
    passenger: Passenger;
    flight: Flight;
    numberOfTickets: number;
    totalCost: number;

    constructor(passenger: Passenger, flight: Flight, numberOfTickets: number, baggageWeight: number) {
        this.bookingId = Booking.bookingCounter++;
        this.passenger = passenger;
        this.flight = flight;
        this.numberOfTickets = numberOfTickets;

        let ticketPrice = flight instanceof DomesticFlight ? 1_000_000 : 2_500_000;
        let baggageFee = flight.calculateBaggageFee(baggageWeight);

        this.totalCost = numberOfTickets * ticketPrice + baggageFee;
    }
    getBookingDetails(): string {
        return `BookingID: ${this.bookingId}, Passenger: ${this.passenger.name}, Flight: ${this.flight.flightNumber}, Tickets: ${this.numberOfTickets}, Total: ${this.totalCost.toLocaleString()} VND`;
    }
}

class GenericRepository<T> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }
    getAll(): T[] {
        return this.items;
    }
    find(predicate: (item: T) => boolean): T | undefined {
        return this.items.find(predicate);
    }
    findIndex(predicate: (item: T) => boolean): number {
        return this.items.findIndex(predicate);
    }
    remove(predicate: (item: T) => boolean): void {
        this.items = this.items.filter(item => predicate(item) === false);
    }
}

class AirlineManager {
    private flightRepo = new GenericRepository<Flight>();
    private passengerRepo = new GenericRepository<Passenger>();
    private bookingRepo = new GenericRepository<Booking>();

    addFlight(flight: Flight): void {
        this.flightRepo.add(flight);
        console.log(`Đã thêm chuyến bay ${flight.flightNumber}`);
    }
    addPassenger(name: string, passportNumber: string): Passenger {
        const passenger = new Passenger(name, passportNumber);
        this.passengerRepo.add(passenger);
        console.log(`Đã thêm hành khách: ${passenger.getDetails()}`);
        return passenger;
    }
    createBooking(passengerId: number, flightNumber: string, numberOfTickets: number, baggageWeight: number): Booking | null {
        const passenger = this.passengerRepo.find(p => p.passengerId === passengerId);
        const flight = this.flightRepo.find(f => f.flightNumber === flightNumber);

        if (!passenger || !flight) {
            console.log("ko tim thấy hàng khách");
            return null;
        }
        if (flight.bookedSeats + numberOfTickets > flight.capacity) {
            console.log("ko đủ chỗ");
            return null;
        }
        for (let i = 0; i < numberOfTickets; i++) {
            flight.bookSeat();
        }

        const booking = new Booking(passenger, flight, numberOfTickets, baggageWeight);
        this.bookingRepo.add(booking);
        console.log(`Đã tạo booking: ${booking.getBookingDetails()}`);
        return booking;
    }
    cancelBooking(bookingId: number): void {
        const booking = this.bookingRepo.find(b => b.bookingId === bookingId);
        if (booking) {
            booking.flight.bookedSeats -= booking.numberOfTickets;
            this.bookingRepo.remove(b => b.bookingId === bookingId);
            console.log(`Booking ${bookingId} cancelled.`);
        }
    }

    listAvailableFlights(origin: string, destination: string): void {
        const flights = this.flightRepo.getAll()
            .filter(f => f.origin === origin && f.destination === destination && f.isFull() === false);
        console.log("các chuyến bay có sẵn:", flights.map(f => f.flightNumber));
    }
    listBookingsByPassenger(passengerId: number): void {
        const bookings = this.bookingRepo.getAll()
            .filter(b => b.passenger.passengerId === passengerId);
        bookings.forEach(b => console.log(b.getBookingDetails()));
    }
    calculateTotalRevenue(): number {
        return this.bookingRepo.getAll().reduce((total, b) => total + b.totalCost, 0);
    }

}

const airline = new AirlineManager();
let choice: number;

do {
    choice = Number(prompt(
        `1. Thêm hành khách
        2. Thêm chuyến bay
        3. Tạo booking
        4. Hủy booking
        5. Xem chuyến bay trống
        6. Xem booking của hành khách
        7. Tổng doanh thu
        8. Đếm chuyến bay theo loại
        9. Cập nhật giờ bay
        10. Danh sách hành khách trên chuyến
        11. Thoát`
    ));

    choice = Number(prompt("Lựa chon của bạn: "));
    switch (choice) {
        case 1:
            const name = prompt("Tên hành khách:") || "";
            const passport = prompt("Số hộ chiếu:") || "";
            airline.addPassenger(name, passport);
            break;
        case 2:
            const type = prompt("Loại (1: Nội địa, 2: Quốc tế):") || "1";
            const fn = prompt("Số hiệu chuyến bay:") || "";
            const ori = prompt("Nơi đi:") || "";
            const des = prompt("Nơi đến:") || "";
            const dep = new Date(prompt("Thời gian khởi hành: ") || "");
            const cap = Number(prompt("Sức chứa:") || "0");
            if (type === "1") {
                airline.addFlight(new DomesticFlight(fn, ori, des, dep, cap));
            } else {
                airline.addFlight(new InternationalFlight(fn, ori, des, dep, cap));
            }
            break;
        case 3:
            const pid = Number(prompt("ID hành khách:") || "0");
            const fnum = prompt("Số hiệu chuyến bay:") || "";
            const tickets = Number(prompt("Số lượng vé:") || "");
            const baggage = Number(prompt("Cân nặng hành lý (kg):") || "0");
            airline.createBooking(pid, fnum, tickets, baggage);
            break;
        case 4:
            const bid = Number(prompt("Booking ID:") || "0");
            airline.cancelBooking(bid);
            break;
        case 5:
            const o = prompt("Nơi đi:") || "";
            const d = prompt("Nơi đến:") || "";
            airline.listAvailableFlights(o, d);
            break;
        case 6:
            const pid2 = Number(prompt("ID hành khách:") || "0");
            airline.listBookingsByPassenger(pid2);
            break;
        case 7:
            console.log("Tổng doanh thu:", airline.calculateTotalRevenue());
            break;
        case 8:
            break;
        case 9:
            break;
        case 10:
            break;
        case 11:
            console.log("Thoát chương trình");
            break;
        default:
            console.log("Lựa chọn không hợp lệ");
    }
} while (choice !== 11);
