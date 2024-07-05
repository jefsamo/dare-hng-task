import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import axios from 'axios';

@Controller()
export class AppController {
  constructor() {}

  @Get('hello')
  async getHello(
    @Query('visitor_name') visitorName: string,
    @Req() request: Request,
  ) {
    if (!visitorName) {
      throw new BadRequestException('Visitors name is required');
    }
    const clientIp = request.ip;
    console.log(clientIp);

    return await this.getLocation(clientIp);
  }

  async getLocation(ip: string | any) {
    try {
      // Get location data from IPStack

      const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY;
      const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
      const locationResponse = await axios.get(
        `http://api.ipstack.com/${ip}?access_key=${IPSTACK_API_KEY}`,
      );
      console.log(locationResponse);
      const city = locationResponse.data.city ?? 'Lagos';

      // Get weather data from OpenWeatherMap
      const weatherResponse = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`,
      );
      const temperature = weatherResponse?.data?.main?.temp;

      return {
        client_ip: ip,
        location: city,
        greeting: `Hello, ${ip}!, the temperature is ${temperature} degrees Celcius in ${city}`,
      };
    } catch (error) {
      console.error('Error fetching location or weather data:', error);
      throw new BadRequestException('Unable to fetch location or weather data');
    }
  }
}
