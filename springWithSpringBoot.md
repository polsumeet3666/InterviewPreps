# learning spring with spring boot

## Pre-Requirement
* jdk 8
* mvc design pattern
* repository design pattern

## Intro to Spring
* removes boiler plate code and helps to focus on business logic
* POJO - (attributes and behavior )
  it has more behaviors than just getters and setters
* Java Bean - (attributes and behaviour)
  it has only getters and setters as behaviors
* DTO - (attributes and behavior)
  only transfer data from one layer to another
* Boiler Plate Actions
	- dependncy management and injection
	- data access and connection
	- jee intergration (security,messaging,caching etc)
	- controller integration through mvc
* Application Context 
	- wrap around bean factory

## Intro to Spring boot
* rapid application development
* removes boiler plate code and keep just to run app
* it create executable jar with all dependency needed by project , you can deploy as war to traditional app servers
* Key component covered
	-  embedded tomcat application server
	- auto-config and component scan in application context
	- automatic servlet mapping
	- embedded databases and DML/DDL (we can pre populate db with sechema and data)
	- hibernate entityManager and dialect
	- controller mapping
	- all component set to scan via annotations

### Spring Initalizr
* www.start.spring.io
* dependencies
	- web
	- jpa
	- hibernate
	- thymeleaf
 	- h2database
* spingboot project skeleton
	 - src/main/java -  java code
	 - src/main/resource - htmls,properties,sql files
	 - application.properties
	 	eg. server.port=8000 (this will start tomcat on 8000 port)
	 
## Data Access
**Springboot : embedded database and configuration**

* copy data.sql  & schema.sql to src/main/resource (_if you have already created data.sql and schema.sql_)
* spring.jpa.hibernate.ddl-auto=none (_this setting turns off hibernate auto schema generation_)	
* when app is started schema.sql (DDL) and data.sql (DML) are automatically executed.

**Spring Data**

* set of interfaces to variety of datasource and technologies
* naming method (_provides common method naming convention so that db can be changed behind the scene _)
* data repository and data mapping
* benefits of using spring data
	- reduce boiler plate code
	- swap database much easier 
	- allows to focus on business logic not on data access logic
* key components
	- repository (_interface to repostory desing pattern_)
	- entity (_object that represent table in rdbms_)

**Build spring data repository with spring data jpa**

* create package com.example.data.entity 
``` 
// Example data entity
@Entity	//jpa annotation
@Table(name="ROOM")  //mapping table name
public class Room {
	@Id
	@Column(name="ROOM_ID")  //mapping columns as name are diffrent
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	@Column(name="NAME")
	private String name;
	@Column(name="ROOM_NUMBER")
	private String number;
	@Column(name="BED_INFO")
	private String bedInfo;
	
	// getters and setters below
}

```
* create package com.example.data.repository & create below interface
```
@Repository
public interface RoomRepository extends CrudRepository<Room,Long>{
	// below code will automatically generate select query based on number
	Room findByNumber(String number);
}
```
## Service Tier

** Service abstraction **

* @Service 

## WebPages with Spring

** Intro to controller **

* mvc desing pattern
* responds to all request through @RequestMapping annotation
* controls  building of data and resolving views

** Build First Controller **

* @Controller - for mvc controller
```
@Controller
public class ReservationController {

	@RequestMapping(value="/reservations",method=RequestMethod.GET)
	public String getReservations() {
		/***
		 * below string  is converted to html template under 
		 * src/main/resource/template
		 */
		return "reservations";
	}
}

```
* template file under src/main/resource/template/reservations.html
```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/> <!--close this meta tag as it breaks some java 8 features -->
<title>Insert title here</title>
</head>
<body>
	<h1>reservations endpoint</h1>
</body>
</html>
```

** Thymeleaf as rendering engine**

```
<!DOCTYPE html>
<!-- below we have added thymeleaf namespace -->
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <title>Landon Reservations</title>

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/ui-darkness/jquery-ui.css"/>
    <link rel="stylesheet" href="css/site.css"/>
</head>
<body>
<h1>Welcome to the Reservations Page</h1>
<p>Date: <input type="text" id="datepicker"/></p>

<table>
    <tr>
        <td>Room</td>
        <td>Room Number</td>
        <td>Guest</td>
    </tr>
    <tr th:each="roomReservation:${roomReservation}">
    	<td th:text="${roomReservation.roomName}">Room Name</td>
    	<td th:text="${roomReservation.roomNumber}">Room Number</td>
    	<td th:text="${roomReservation.lastName} + ','+ ${roomReservation.firstName}">Name</td>
    </tr>

</table>

<script src="http://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<script src="js/site.js"></script>
</body>
</html>
```

** Update Controller **

```
package com.sppol.reservation.landon.webapplication;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sppol.reservation.landon.business.domain.RoomReservation;
import com.sppol.reservation.landon.business.service.ReservationService;

@Controller
public class ReservationController {
	
	public static final DateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
	
	@Autowired
	private ReservationService reservationService;

	@RequestMapping(value="/reservations",method=RequestMethod.GET)
	public String getReservations(@RequestParam(value="date",required=false) String dateString,Model model) {
		Date date = null;
		// if date is passed then format to above format
		
		if (null != dateString) {
			try {
				date= DATE_FORMAT.parse(dateString);
			} catch (ParseException e) {
				// TODO: handle exception
				date = new Date();
			}
		}
		else {
			//else asume today's date
			date = new Date();
		}
		List<RoomReservation> roomReservation = this.reservationService.getRoomReservationsForDate(date);
		model.addAttribute("roomReservations", roomReservation);
		/***
		 * below string  is converted to html template under 
		 * src/main/resource/template
		 */
		return "reservations";
	}
}

```

** Test a controller MockMVC **

* built in testing 
```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-test</artifactId>
	<scope>test</scope>
</dependency>
```

* create test under src/main/java/test
```
package com.sppol.reservation.landon.webapplication;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.sppol.reservation.landon.business.domain.RoomReservation;
import com.sppol.reservation.landon.business.service.ReservationService;

import static org.mockito.BDDMockito.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@WebMvcTest(ReservationController.class)
public class ReservationControllerTest {

	@MockBean
	private ReservationService reservationService;
	@Autowired
	private MockMvc mockMvc; 
	public static final DateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
	
	@Test
    public void getReservations() throws Exception{
        Date date = DATE_FORMAT.parse("2017-01-01");
        List<RoomReservation> mockReservationList = new ArrayList<>();
        RoomReservation mockRoomReservation = new RoomReservation();
        mockRoomReservation.setLastName("Test");
        mockRoomReservation.setFirstName("JUnit");
        mockRoomReservation.setDate(date);
        mockRoomReservation.setGuestId(1);
        mockRoomReservation.setRoomNumber("J1");
        mockRoomReservation.setRoomId(100);
        mockRoomReservation.setRoomName("JUnit Room");
        mockReservationList.add(mockRoomReservation);

        given(reservationService.getRoomReservationsForDate(date)).willReturn(mockReservationList);
        this.mockMvc.perform(get("/reservations?date=2017-01-01”)).andExpect(status().isOk()).andExpect(content().string(containsString('Test,JUnit')"));
    }
}

```

## RESTful Endpoint

* similar to @Controller 
	- provides @RequestMapping interface for dispatcher
	- control url mapping
	- model 
* difference to @Controller
	- return ResponseBody
	- returns Object instead of string to view it gives marshaled XML or JSON 
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	



















