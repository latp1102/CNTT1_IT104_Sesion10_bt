var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Passenger = /** @class */ (function () {
    function Passenger(name, passportNumber) {
        this.passengerId = Passenger.idCounter++;
        this.name = name;
        this.passportNumber = passportNumber;
    }
    Passenger.prototype.getDetails = function () {
        return "ID: ".concat(this.passengerId, ", Name: ").concat(this.name, ", Passport: ").concat(this.passportNumber);
    };
    Passenger.idCounter = 1;
    return Passenger;
}());
var Flight = /** @class */ (function () {
    function Flight(flightNumber, origin, destination, departureTime, capacity) {
        this.bookedSeats = 0;
        this.flightNumber = flightNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.capacity = capacity;
    }
    Flight.prototype.bookSeat = function () {
        if (!this.isFull()) {
            this.bookedSeats++;
        }
    };
    Flight.prototype.isFull = function () {
        return this.bookedSeats >= this.capacity;
    };
    return Flight;
}());
var DomesticFlight = /** @class */ (function (_super) {
    __extends(DomesticFlight, _super);
    function DomesticFlight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DomesticFlight.prototype.calculateBaggageFee = function (weight) {
        return weight * 50000;
    };
    return DomesticFlight;
}(Flight));
var InternationalFlight = /** @class */ (function (_super) {
    __extends(InternationalFlight, _super);
    function InternationalFlight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InternationalFlight.prototype.calculateBaggageFee = function (weight) {
        return weight * 10 * 25000;
    };
    return InternationalFlight;
}(Flight));
var Booking = /** @class */ (function () {
    function Booking(passenger, flight, numberOfTickets, baggageWeight) {
        this.bookingId = Booking.bookingCounter++;
        this.passenger = passenger;
        this.flight = flight;
        this.numberOfTickets = numberOfTickets;
        var ticketPrice = flight instanceof DomesticFlight ? 1000000 : 2500000;
        var baggageFee = flight.calculateBaggageFee(baggageWeight);
        this.totalCost = numberOfTickets * ticketPrice + baggageFee;
    }
    Booking.prototype.getBookingDetails = function () {
        return "BookingID: ".concat(this.bookingId, ", Passenger: ").concat(this.passenger.name, ", Flight: ").concat(this.flight.flightNumber, ", Tickets: ").concat(this.numberOfTickets, ", Total: ").concat(this.totalCost.toLocaleString(), " VND");
    };
    Booking.bookingCounter = 1;
    return Booking;
}());
var GenericRepository = /** @class */ (function () {
    function GenericRepository() {
        this.items = [];
    }
    GenericRepository.prototype.add = function (item) {
        this.items.push(item);
    };
    GenericRepository.prototype.getAll = function () {
        return this.items;
    };
    GenericRepository.prototype.find = function (predicate) {
        return this.items.find(predicate);
    };
    GenericRepository.prototype.findIndex = function (predicate) {
        return this.items.findIndex(predicate);
    };
    GenericRepository.prototype.remove = function (predicate) {
        this.items = this.items.filter(function (item) { return predicate(item) === false; });
    };
    return GenericRepository;
}());
var AirlineManager = /** @class */ (function () {
    function AirlineManager() {
        this.flightRepo = new GenericRepository();
        this.passengerRepo = new GenericRepository();
        this.bookingRepo = new GenericRepository();
    }
    AirlineManager.prototype.addFlight = function (flight) {
        this.flightRepo.add(flight);
        console.log("\u0110\u00E3 th\u00EAm chuy\u1EBFn bay ".concat(flight.flightNumber));
    };
    AirlineManager.prototype.addPassenger = function (name, passportNumber) {
        var passenger = new Passenger(name, passportNumber);
        this.passengerRepo.add(passenger);
        console.log("\u0110\u00E3 th\u00EAm h\u00E0nh kh\u00E1ch: ".concat(passenger.getDetails()));
        return passenger;
    };
    AirlineManager.prototype.createBooking = function (passengerId, flightNumber, numberOfTickets, baggageWeight) {
        var passenger = this.passengerRepo.find(function (p) { return p.passengerId === passengerId; });
        var flight = this.flightRepo.find(function (f) { return f.flightNumber === flightNumber; });
        if (!passenger || !flight) {
            console.log("ko tim thấy hàng khách");
            return null;
        }
        if (flight.bookedSeats + numberOfTickets > flight.capacity) {
            console.log("ko đủ chỗ");
            return null;
        }
        for (var i = 0; i < numberOfTickets; i++) {
            flight.bookSeat();
        }
        var booking = new Booking(passenger, flight, numberOfTickets, baggageWeight);
        this.bookingRepo.add(booking);
        console.log("\u0110\u00E3 t\u1EA1o booking: ".concat(booking.getBookingDetails()));
        return booking;
    };
    AirlineManager.prototype.cancelBooking = function (bookingId) {
        var booking = this.bookingRepo.find(function (b) { return b.bookingId === bookingId; });
        if (booking) {
            booking.flight.bookedSeats -= booking.numberOfTickets;
            this.bookingRepo.remove(function (b) { return b.bookingId === bookingId; });
            console.log("Booking ".concat(bookingId, " cancelled."));
        }
    };
    AirlineManager.prototype.listAvailableFlights = function (origin, destination) {
        var flights = this.flightRepo.getAll()
            .filter(function (f) { return f.origin === origin && f.destination === destination && f.isFull() === false; });
        console.log("các chuyến bay có sẵn:", flights.map(function (f) { return f.flightNumber; }));
    };
    AirlineManager.prototype.listBookingsByPassenger = function (passengerId) {
        var bookings = this.bookingRepo.getAll()
            .filter(function (b) { return b.passenger.passengerId === passengerId; });
        bookings.forEach(function (b) { return console.log(b.getBookingDetails()); });
    };
    AirlineManager.prototype.calculateTotalRevenue = function () {
        return this.bookingRepo.getAll().reduce(function (total, b) { return total + b.totalCost; }, 0);
    };
    return AirlineManager;
}());
var airline = new AirlineManager();
var choice;
do {
    choice = Number(prompt("1. Th\u00EAm h\u00E0nh kh\u00E1ch\n        2. Th\u00EAm chuy\u1EBFn bay\n        3. T\u1EA1o booking\n        4. H\u1EE7y booking\n        5. Xem chuy\u1EBFn bay tr\u1ED1ng\n        6. Xem booking c\u1EE7a h\u00E0nh kh\u00E1ch\n        7. T\u1ED5ng doanh thu\n        8. \u0110\u1EBFm chuy\u1EBFn bay theo lo\u1EA1i\n        9. C\u1EADp nh\u1EADt gi\u1EDD bay\n        10. Danh s\u00E1ch h\u00E0nh kh\u00E1ch tr\u00EAn chuy\u1EBFn\n        11. Tho\u00E1t"));
    choice = Number(prompt("Lựa chon của bạn: "));
    switch (choice) {
        case 1:
            var name_1 = prompt("Tên hành khách:") || "";
            var passport = prompt("Số hộ chiếu:") || "";
            airline.addPassenger(name_1, passport);
            break;
        case 2:
            var type = prompt("Loại (1: Nội địa, 2: Quốc tế):") || "1";
            var fn = prompt("Số hiệu chuyến bay:") || "";
            var ori = prompt("Nơi đi:") || "";
            var des = prompt("Nơi đến:") || "";
            var dep = new Date(prompt("Thời gian khởi hành:") || "");
            var cap = Number(prompt("Sức chứa:") || "0");
            if (type === "1") {
                airline.addFlight(new DomesticFlight(fn, ori, des, dep, cap));
            }
            else {
                airline.addFlight(new InternationalFlight(fn, ori, des, dep, cap));
            }
            break;
        case 3:
            var pid = Number(prompt("ID hành khách:") || "0");
            var fnum = prompt("Số hiệu chuyến bay:") || "";
            var tickets = Number(prompt("Số lượng vé:") || "");
            var baggage = Number(prompt("Cân nặng hành lý (kg):") || "0");
            airline.createBooking(pid, fnum, tickets, baggage);
            break;
        case 4:
            var bid = Number(prompt("Booking ID:") || "0");
            airline.cancelBooking(bid);
            break;
        case 5:
            var o = prompt("Nơi đi:") || "";
            var d = prompt("Nơi đến:") || "";
            airline.listAvailableFlights(o, d);
            break;
        case 6:
            var pid2 = Number(prompt("ID hành khách:") || "0");
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
