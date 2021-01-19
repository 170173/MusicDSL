package com.github.nnnnusui.musicdsl.input

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

sealed trait Note
object Note {
  case class Create(offset: Int, octave: Int, pitch: Int) extends Note
  case class GetAll() extends Note
  trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
    implicit val createInput = jsonFormat3(Create)
  }
}
