package com.github.nnnnusui.musicdsl.output

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

sealed trait Sound
object Sound {
  case class Get(pcm: Seq[Double])
  trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
    implicit val createOutput = jsonFormat1(Get)
  }
}